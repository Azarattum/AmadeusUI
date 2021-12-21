/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import unlock, { isiOS } from "utils/unlocker";
import { fetchTrack } from "utils/mock";
import type { Track } from "./tracks";
import { hash, none } from "./tracks";
import EventEmmiter from "./emmiter";

if ("window" in globalThis) {
  if (window.UINative) window.UINative.nativeAudio();
  else if (isiOS()) unlock();
}

export default class AudioPlayer extends EventEmmiter {
  private previousCallback = this.onPrev.bind(this);
  private pausedCallback = this.onPause.bind(this);
  private nextCallback = this.onNext.bind(this);
  private endedCallback = this.onEnd.bind(this);
  private playCallback = this.onPlay.bind(this);
  private timeCallback = this.onTime.bind(this);

  private cacheLimit = 2;
  private cached: Cache[] = [];
  private audio: Audio | null = null;
  private now = "";

  private negative: boolean | NodeJS.Timer = false;
  private loading = false;
  private paused = true;

  forcePlay = false;

  debug = false;
  private log: (...params: any[]) => void = () => {};
  constructor({ debug }: PlayerOptions = { debug: false }) {
    super();
    if ((this.debug = debug)) {
      this.log = (...params: any[]) => {
        console.log(`[${this.constructor.name}/DEBUG]:`, ...params);
      };
    }
  }

  get isLoading(): boolean {
    return this.loading;
  }

  set isLoading(value: boolean) {
    if (this.loading === value) return;
    this.loading = value;
    this.dispatchEvent(new Event("loadingchange"));
  }

  get isPaused(): boolean {
    return this.paused;
  }

  set isPaused(value: boolean) {
    if (this.paused === value) return;
    this.paused = value;
    this.dispatchEvent(new Event("pausedchange"));
  }

  async play(track: Track): Promise<void> {
    const error = new Error("Loading was interrupted!");
    if (this.isPlaying(track)) return;
    const previous = this.now;
    this.now = track == none ? "" : hash(track);
    if (!this.now) return;

    //Cache the current track if it is loaded
    const cacheable = !this.isLoading && previous && this.audio?.src;
    if (cacheable && this.audio) {
      this.cached.push({
        hash: previous,
        loaded: true,
        data: this.audio,
      });
      this.audio.preload = "none";
      this.log("Track cached:", previous);
    }

    //Update state params and current audio
    const update = (audio: Audio) => {
      //Instantly update metadata
      if (cacheable && this.audio) this.updateMetadata(track);
      const temp = this.audio;
      this.audio = audio;
      if (cacheable && temp) {
        temp.pause();
        temp.currentTime = 0;
      } else this.destroyAudio(temp);
      //Reset time
      this.dispatchEvent(new CustomEvent("timeupdate", { detail: 0 }));
    };

    //Load audio from cache or create a new one
    const cache = this.fromCache(track, true);
    //Uncache overflow
    if (this.cached.length > this.cacheLimit) {
      const item = this.cached.shift();
      if (item && item !== cache) {
        this.destroyAudio(item.data);
        this.log("Track removed from cache:", item.hash);
      }
    }
    if (!cache) {
      this.isLoading = true;
      update(this.createAudio());
      const url = await fetchTrack(track.sources);
      if (!this.isPlaying(track)) throw error;
      if (url && this.audio) this.audio.src = url;
    } else {
      update(cache.data);
      this.log("Track retrieved from cache:", cache.hash);
    }

    //Sync playback state of the new audio
    const resume = () => {
      if (!this.isPlaying(track)) throw error;
      if (!this.audio) throw error;
      this.updateMetadata(track);
      this.isLoading = false;
      this.log("Track loaded:", track);
      //Resume audio when possible
      const isIdle = "requestIdleCallback" in globalThis;
      (isIdle ? requestIdleCallback : setTimeout)(
        () => {
          if (!this.isPlaying(track)) throw error;
          if (!this.audio) throw error;
          if (this.isPaused && !this.audio.paused) this.audio.pause();
          else if (!this.isPaused || this.forcePlay) {
            this.log("Track autoplayed", {
              paused: this.isPaused,
              force: this.forcePlay,
            });
            this.audio.play();
            this.forcePlay = false;
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (isIdle ? { timeout: 300 } : 300) as any
      );
    };

    //Properly manage loading state
    if (!cache?.loaded) {
      this.isLoading = true;
      const event = isiOS() && !window.UINative ? "canplaythrough" : "canplay";
      this.audio?.addEventListener(event, resume, { once: true });
      await new Promise((resolve) => {
        this.audio?.addEventListener("canplaythrough", resolve, { once: true });
      });
    } else resume();
    if (!this.isPlaying(track)) throw error;
  }

  async cache(track: Track): Promise<void> {
    if (!track || track === none) return;
    if (track.sources.length <= 0) return;
    if (this.fromCache(track)) return;

    const cached = {
      hash: hash(track),
      loaded: false,
      data: this.createAudio(),
    };
    this.cached.push(cached);
    this.log("Track cached:", hash(track));
    if (this.cached.length > this.cacheLimit) {
      const item = this.cached.shift();
      if (item && item.data?.valueOf() !== this.audio?.valueOf()) {
        this.destroyAudio(item.data);
        this.log("Track removed from cache:", item.hash);
      }
    }

    const isValid = () => this.fromCache(track) || this.isPlaying(track);

    const url = await fetchTrack(track.sources);
    //If there is not url remove from cache
    if (!url) {
      this.fromCache(track, true);
      return;
    }
    if (!isValid()) return this.log("Gave up on loading:", hash(track));
    const event = isiOS() && !window.UINative ? "canplaythrough" : "canplay";
    cached.data.addEventListener(
      event,
      () => {
        if (!isValid()) return this.log("Gave up on loading:", hash(track));
        cached.loaded = true;
        this.log("Cache loaded:", cached);
      },
      { once: true }
    );
    cached.data.src = url;
  }

  resume(): void {
    if (!this.isPaused) return;
    if (!this.audio?.src) return;
    this.audio.play();
  }

  pause(): void {
    if (this.isPaused) return;
    if (!this.audio?.src) return;
    this.audio.pause();
  }

  speedup(factor: number): void {
    if (!this.audio) return;
    if (factor && factor !== 1 && this.paused) return;
    if (this.audio.playbackRate !== factor) {
      if (factor < 0) {
        if (!this.negative) this.negative = true;
      } else {
        clearInterval(this.negative as NodeJS.Timer);
        this.negative = false;
      }
      try {
        this.audio.playbackRate = factor;
      } catch {
        if (!this.negative) return;
        this.log("Using rewind fallback implementation");

        this.audio.playbackRate = 0;
        this.negative = setInterval(() => {
          if (!this.audio) return;
          this.seek(this.audio.currentTime - 1);
        }, 200);
      }
    }
  }

  seek(time: number): void {
    if (!this.audio) return;
    if (Math.abs(this.audio.currentTime - time) < 1) return;
    if (time < 0) time = 0;
    if (time > this.audio.duration) time = this.audio.duration;
    this.log("Seeked to", time);
    this.audio.currentTime = time;
  }

  destroy(): void {
    this.destroyAudio(this.audio);
    this.now = "";

    for (const item of this.cached) {
      this.destroyAudio(item.data);
    }
    this.cached = [];
  }

  setupControls(): void {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      if (!this.audio) return;
      this.seek(this.audio.currentTime - 5);
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
      if (!this.audio) return;
      this.seek(this.audio.currentTime + 5);
    });
    navigator.mediaSession.setActionHandler("seekto", ({ seekTime }) => {
      if (seekTime != null) this.seek(seekTime);
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      this.dispatchEvent(new Event("previous"));
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      this.dispatchEvent(new Event("next"));
    });
  }

  private isPlaying(track: Track): boolean {
    return hash(track) === this.now;
  }

  private fromCache(track: Track, remove = false): Cache | undefined {
    const key = hash(track);
    const index = this.cached.findIndex((x) => x.hash === key);
    if (index < 0) return undefined;
    const item = this.cached[index];
    if (remove) this.cached.splice(index, 1);
    return item;
  }

  private createAudio(): Audio {
    const audio = new Audio() as Audio;
    audio.addEventListener("timeupdate", this.timeCallback);
    audio.addEventListener("pause", this.pausedCallback);
    audio.addEventListener("ended", this.endedCallback);
    audio.addEventListener("play", this.playCallback);
    audio.addEventListener("next", this.nextCallback);
    audio.addEventListener("previous", this.previousCallback);
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";

    this.log("Audio created", audio);
    return audio;
  }

  private destroyAudio(audio: Audio | null) {
    if (!audio) return;
    audio.removeEventListener("timeupdate", this.timeCallback);
    audio.removeEventListener("pause", this.pausedCallback);
    audio.removeEventListener("ended", this.endedCallback);
    audio.removeEventListener("play", this.playCallback);
    audio.removeEventListener("next", this.nextCallback);
    audio.removeEventListener("previous", this.previousCallback);
    audio.src = "";
    audio.destroyed = true;
    if (audio?.valueOf() === this.audio?.valueOf()) this.audio = null;
    this.log("Audio destroyed", audio);
  }

  private updateMetadata(track: Track) {
    if (!this.audio) return;
    this.audio.metadata = {
      title: track.title,
      artist: track.artists.join(", "),
      album: track.album,
      year: track.year,
      length: track.length,
      cover: track.cover,
    };
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artists.join(", "),
      album: track.album,
      artwork: track.cover
        ? [
            {
              src: track.cover,
              sizes: "512x512",
              type: "image/png",
            },
          ]
        : [],
    });
    this.setupControls();
  }

  private onTime({ target }: { target: EventTarget | null }): void {
    if (target != this.audio?.valueOf()) return;
    if (!this.audio) return;
    this.dispatchEvent(
      new CustomEvent("timeupdate", { detail: this.audio.currentTime })
    );

    if (
      !("mediaSession" in navigator) ||
      this.audio.playbackRate <= 0 ||
      !Number.isFinite(this.audio.duration)
    ) {
      return;
    }
    navigator.mediaSession.setPositionState({
      position: this.audio.currentTime,
      duration: this.audio.duration,
      playbackRate: this.audio.playbackRate,
    });
  }

  private onPause({ target }: { target: EventTarget | null }): void {
    if (target != this.audio?.valueOf()) return;
    if (this.isPaused) return;
    this.isPaused = true;
    this.log("Paused", { audio: this.audio?.paused, player: this.isPaused });
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = "paused";
  }

  private onPlay({ target }: { target: EventTarget | null }): void {
    if (target != this.audio?.valueOf()) return;
    if (!this.isPaused) return;
    this.isPaused = false;
    this.log("Played", { audio: !this.audio?.paused, player: !this.isPaused });
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = "playing";
  }

  private onEnd({ target }: { target: EventTarget | null }): void {
    if (target != this.audio?.valueOf()) return;
    if (!this.audio) return;
    if (this.negative || !this.audio.currentTime) {
      this.seek(0);
      return;
    }

    this.log("Audio ended");
    this.dispatchEvent(new Event("ended"));
  }

  private onNext({ target }: { target: EventTarget | null }): void {
    if (target != this.audio?.valueOf()) return;
    if (!this.audio) return;
    this.dispatchEvent(new Event("next"));
  }

  private onPrev({ target }: { target: EventTarget | null }): void {
    if (target != this.audio?.valueOf()) return;
    if (!this.audio) return;
    this.dispatchEvent(new Event("previous"));
  }
}

interface Cache {
  hash: string;
  loaded: boolean;
  data: Audio;
}

export interface PlayerOptions {
  debug: boolean;
}

export type Audio = HTMLMediaElement & {
  metadata: {
    title: string;
    artist: string;

    album?: string;
    year?: number;
    length?: number;
    cover?: string;
  };
  destroyed: boolean;
};
