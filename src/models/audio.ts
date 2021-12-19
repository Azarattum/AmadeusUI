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
  private pausedCallback = this.onPause.bind(this);
  private playCallback = this.onPlay.bind(this);
  private timeCallback = this.onTime.bind(this);

  private cacheLimit = 2;
  private cached: Cache[] = [];
  private audio: Audio | null = null;
  private now = "";

  private loading = false;
  private paused = true;

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
      console.log("cached", previous);
    }

    //Update state params and current audio
    const update = (audio: Audio) => {
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
        console.log("uncached", item?.hash);
      }
    }
    if (!cache) {
      this.isLoading = true;
      update(this.createAudio());
      const url = await fetchTrack(track.sources);
      if (!this.isPlaying(track)) throw error;
      if (url && this.audio) this.audio.src = url;
      console.log("src", url);
    } else {
      update(cache.data);
      console.log("from cache", track.title, cache);
    }

    //Sync playback state of the new audio
    const resume = () => {
      if (!this.isPlaying(track)) throw error;
      if (!this.audio) throw error;
      this.updateMetadata(track);
      this.isLoading = false;
      //Resume audio when possible
      const isIdle = "requestIdleCallback" in globalThis;
      (isIdle ? requestIdleCallback : setTimeout)(
        () => {
          if (!this.isPlaying(track)) throw error;
          if (!this.audio) throw error;
          if (this.isPaused && !this.audio.paused) this.audio.pause();
          else if (!this.isPaused && this.audio.paused) this.audio.play();
          else if (!previous && this.audio.paused) this.audio.play();
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
    if (this.cached.length > this.cacheLimit) {
      const item = this.cached.shift();
      if (item && item.data?.valueOf() !== this.audio?.valueOf()) {
        this.destroyAudio(item.data);
      }
    }

    const isValid = () => this.fromCache(track) || this.isPlaying(track);

    const url = await fetchTrack(track.sources);
    //If there is not url remove from cache
    if (!url) {
      this.fromCache(track, true);
      return;
    }
    if (!isValid()) return console.log("gave up on", track.title);
    const event = isiOS() && !window.UINative ? "canplaythrough" : "canplay";
    cached.data.addEventListener(
      event,
      () => {
        if (!isValid()) return console.log("gave up on", track.title);
        cached.loaded = true;
      },
      { once: true }
    );
    cached.data.src = url;
    console.log("src", url);
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

  seek(time: number): void {
    if (!this.audio) return;
    if (Math.abs(this.audio.currentTime - time) <= 1) return;
    console.log("seeked to", time);
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
    audio.addEventListener("play", this.playCallback);
    audio.preload = "auto";
    return audio;
  }

  private destroyAudio(audio: Audio | null) {
    if (!audio) return;
    audio.removeEventListener("timeupdate", this.timeCallback);
    audio.removeEventListener("pause", this.pausedCallback);
    audio.removeEventListener("play", this.playCallback);
    console.log("!src", audio.src);
    audio.src = "";
    audio.destroyed = true;
    if (audio?.valueOf() === this.audio?.valueOf()) this.audio = null;
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
  }

  private onTime({ target }: { target: EventTarget | null }): void {
    if (target != this.audio?.valueOf()) return;
    if (!this.audio) return;
    this.dispatchEvent(
      new CustomEvent("timeupdate", { detail: this.audio.currentTime })
    );
  }

  private onPause({ target }: { target: EventTarget | null }): void {
    if (target != this.audio?.valueOf()) return;
    if (this.isPaused) return;
    this.isPaused = true;
  }

  private onPlay({ target }: { target: EventTarget | null }): void {
    if (target != this.audio?.valueOf()) return;
    if (!this.isPaused) return;
    this.isPaused = false;
  }
}

interface Cache {
  hash: string;
  loaded: boolean;
  data: Audio;
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
