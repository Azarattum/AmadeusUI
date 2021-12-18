import { fetchTrack } from "utils/mock";
import type { Track } from "./tracks";
import EventEmmiter from "./emmiter";
import { hash } from "./tracks";
import { none } from "./tracks";

// if ("window" in globalThis) {
//   if (window.UINative) window.UINative.nativeAudio();
// }

export default class AudioPlayer extends EventEmmiter {
  private pausedCallback = this.onPause.bind(this);
  private playCallback = this.onPlay.bind(this);

  private cacheLimit = 2;
  private cached: Cache[] = [];
  private audio = this.createAudio();
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

    console.log(track);

    //Cache the current track if it is loaded
    const cacheable = !this.isLoading && previous && this.audio.src;
    if (cacheable) {
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
      this.updateMetadata(track);
      if (cacheable) {
        temp.pause();
        temp.currentTime = 0;
      } else this.destroyAudio(temp);
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
      if (url) this.audio.src = url;
      console.log("src", url);
    } else {
      update(cache.data);
      console.log("from cache", track.title, cache.loaded);
    }

    //Sync playback state of the new audio
    const resume = () => {
      if (!this.isPlaying(track)) throw error;
      this.isLoading = false;
      if (this.isPaused && !this.audio.paused) this.audio.pause();
      else if (!this.isPaused && this.audio.paused) this.audio.play();
      else if (!previous && this.audio.paused) this.audio.play();
    };

    //Properly manage loading state
    if (!cache?.loaded) {
      this.isLoading = true;
      this.audio.addEventListener("canplay", resume, { once: true });
      await new Promise((resolve) => {
        this.audio.addEventListener("canplaythrough", resolve, { once: true });
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
      if (item && item.data !== this.audio) this.destroyAudio(item.data);
    }

    const isValid = () => this.fromCache(track) || this.isPlaying(track);

    const url = await fetchTrack(track.sources);
    //If there is not url remove from cache
    if (!url) {
      this.fromCache(track, true);
      return;
    }
    if (!isValid()) return console.log("gave up on", track.title);
    cached.data.addEventListener(
      "canplay",
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
    if (!this.audio.src) return;
    this.audio.play();
  }

  pause(): void {
    if (this.isPaused) return;
    if (!this.audio.src) return;
    this.audio.pause();
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
    audio.addEventListener("pause", this.pausedCallback);
    audio.addEventListener("play", this.playCallback);
    audio.preload = "auto";
    return audio;
  }

  private destroyAudio(audio: Audio) {
    audio.removeEventListener("pause", this.pausedCallback);
    audio.removeEventListener("play", this.playCallback);
    console.log("!src", audio.src);
    audio.src = "";
    audio.destroyed = true;
  }

  private updateMetadata(track: Track) {
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

  private onPause({ target }: { target: EventTarget | null }): void {
    if (target != this.audio) return;
    if (this.isPaused) return;
    this.isPaused = true;
  }

  private onPlay({ target }: { target: EventTarget | null }): void {
    if (target != this.audio) return;
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