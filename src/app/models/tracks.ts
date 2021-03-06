import type { Readable, Subscriber, Unsubscriber } from "svelte/store";
import { shuffle } from "../utils/utils";

export interface Track {
  title: string;
  artists: string[];
  album: string;

  length: number;
  year?: number;
  cover?: string;
  sources: string[];
}

export const none: Track = {
  title: "Not Playing",
  artists: ["No Artist"],
  album: "",
  length: Infinity,
  sources: [],
};

export class Tracks implements Readable<Tracks> {
  private subscribers: Subscriber<Tracks>[] = [];
  private backwardQueue: Track[] = [];
  private forwardQueue: Track[] = [];

  current = none;
  history: Track[] = [];
  queue: Track[] = [];
  firstToPlay = false;

  repetition = Repetition.None;
  direction = Direction.Normal;
  infinite = false;

  get upcoming(): Track | null {
    if (this.queue[0]) return this.queue[0];
    if (this.repetition === Repetition.All && this.history[0]) {
      return this.history[0];
    }
    return null;
  }

  pushLast(...tracks: Track[]): void {
    if (!tracks.length) return;

    this.queue.push(...tracks);
    if (this.direction != Direction.Backwards) {
      this.forwardQueue.push(...tracks);
    } else {
      this.backwardQueue.push(...tracks);
    }

    this.update();
  }

  pushNext(...tracks: Track[]): void {
    if (!tracks.length) return;

    this.queue.unshift(...tracks);
    if (this.direction != Direction.Backwards) {
      this.forwardQueue.unshift(...tracks);
    } else {
      this.backwardQueue.unshift(...tracks);
    }

    this.update();
  }

  pushAwaiting(...tracks: Track[]): void {
    if (!tracks.length) return;

    if (this.direction == Direction.Backwards) {
      this.forwardQueue.push(...tracks);
    } else {
      this.backwardQueue.push(...tracks);
    }

    if (
      this.repetition === Repetition.All ||
      this.direction === Direction.Shuffled
    ) {
      this.queue.push(...tracks);
      this.update();
    }
  }

  pushPlaylist(tracks: Track[], index = 0): void {
    this.pushNext(...tracks.slice(index));
    this.pushAwaiting(...tracks.slice(0, index));
  }

  play(track: Track): void {
    this.remove(track);
    this.pushNext(track);
    this.next();
  }

  next(): void {
    let item = this.queue[0];
    if (!item) {
      if (this.repetition != Repetition.All) return;
      this.pushNext(...this.history);
      this.clearHistory();
      item = this.queue[0];
      if (!item) return;
    }
    if (this.current != none) this.history.push(this.current);

    this.current = item;
    this.remove(item);

    this.update();
  }

  previous(): void {
    const item = this.history.pop();
    if (!item) return;
    if (this.current != none) this.pushNext(this.current);
    this.current = item;
    this.remove(item);

    this.update();
  }

  direct(direction: Direction): void {
    if (direction == Direction.Normal) {
      if (!this.forwardQueue.length) {
        this.forwardQueue = this.backwardQueue;
        this.backwardQueue = [];
      }
      this.queue = this.forwardQueue.slice();
      if (this.repetition == Repetition.All) {
        this.queue.push(...this.backwardQueue);
      }
    } else if (direction == Direction.Backwards) {
      if (!this.backwardQueue.length) {
        this.backwardQueue = this.forwardQueue;
        this.forwardQueue = [];
      }
      this.queue = this.backwardQueue.slice().reverse();
      if (this.repetition == Repetition.All || !this.queue.length) {
        this.queue.push(...this.forwardQueue.slice().reverse());
      }
    } else {
      this.queue = this.forwardQueue.concat(this.backwardQueue);
      shuffle(this.queue);
    }

    this.direction = direction;
    this.update();
  }

  repeat(repetitions: Repetition): void {
    if (repetitions == this.repetition) return;

    this.repetition = repetitions;
    if (repetitions == Repetition.All) {
      if (this.direction == Direction.Normal) {
        this.queue.push(...this.backwardQueue);
      } else if (this.direction == Direction.Backwards) {
        this.queue.push(...this.forwardQueue.slice().reverse());
      }
    } else {
      if (this.direction == Direction.Normal) {
        this.queue = this.queue.filter((x) => this.forwardQueue.includes(x));
      } else if (this.direction == Direction.Backwards) {
        this.queue = this.queue.filter((x) => this.backwardQueue.includes(x));
      }
    }
    this.update();
  }

  remove(track: Track): void {
    const backwardIndex = this.backwardQueue.indexOf(track);
    const forwardIndex = this.forwardQueue.indexOf(track);
    const queueIndex = this.queue.indexOf(track);

    if (~backwardIndex) this.backwardQueue.splice(backwardIndex, 1);
    if (~forwardIndex) this.forwardQueue.splice(forwardIndex, 1);
    if (~queueIndex) this.queue.splice(queueIndex, 1);
    if (~queueIndex) this.update();
  }

  rearrange(from: number, to: number): void {
    if (from < 0 || from >= this.queue.length) return;
    if (to < 0 || to >= this.queue.length) return;
    if (from === to) return;

    const item = this.queue.splice(from, 1)[0];
    if (!item) return;
    this.queue.splice(to, 0, item);
    this.update();
  }

  clear(): void {
    const updated = this.current != none;
    this.direction = Direction.Normal;
    this.current = none;
    this.clearQueue();
    this.clearHistory();

    if (updated) this.update();
  }

  clearQueue(): void {
    if (
      !this.queue.length &&
      !this.forwardQueue.length &&
      !this.backwardQueue.length
    ) {
      return;
    }

    this.backwardQueue = [];
    this.forwardQueue = [];
    this.queue = [];

    this.update();
  }

  clearHistory(): void {
    if (!this.history.length) return;
    this.history = [];
    this.update();
  }

  subscribe(run: Subscriber<Tracks>): Unsubscriber {
    this.subscribers.push(run);
    run(this);
    return () => {
      this.subscribers.splice(this.subscribers.indexOf(run), 1);
    };
  }

  private debounce?: unknown;
  private update(): void {
    if (this.current === none && this.forwardQueue.length) {
      this.direction = Direction.Normal;
      this.next();
      this.firstToPlay = true;
    }

    clearTimeout(this.debounce as number);
    this.debounce = setTimeout(() => {
      this.subscribers.forEach((x) => x(this));
      this.firstToPlay = false;
    });
  }
}

export enum Direction {
  Normal,
  Backwards,
  Shuffled,
}

export enum Repetition {
  None,
  All,
  Single,
}

export function hash(track: Track): string {
  return `${stringify(track)} - ${track.album.toLowerCase()}`;
}

export function stringify(
  { title, artists }: { title: string; artists: string[] | string },
  reverse = false
): string {
  title = title.toLowerCase().trim();
  artists = Array.isArray(artists)
    ? artists.sort().join(", ").toLowerCase().trim()
    : artists.toLowerCase().trim();

  if (!artists) return purify(title);
  if (reverse) return purify(`${title} - ${artists}`);
  return purify(`${artists} - ${title}`);
}

export function purify(title: string): string {
  return title.replace(/[+,&]/g, " ");
}

const tracks = new Tracks();
export default tracks;
