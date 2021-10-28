import { writable, derived, get } from "svelte/store";
import type { Readable, Writable } from "svelte/store";

export const none: Track = {
  title: "Not Playing",
  artists: [],
  album: "",
  length: Infinity,
};

export class Tracks {
  current: Writable<Track> = writable(none);
  history: Writable<Track[]> = writable([]);
  queue: Writable<Track[]> = writable([]);
  all: Writable<Track[]> = writable([]);

  listened: Readable<number> = derived(
    this.history,
    (history) => history.length
  );

  pushNext(...tracks: Track[]): void {
    this.current.update((current) => {
      if (current === none) {
        const first = tracks.shift();
        if (first) current = first;
      }

      this.queue.update((queue) => {
        queue.unshift(...tracks);
        this.updateAll({ current, queue });
        return queue;
      });

      return current;
    });
  }

  pushLast(...tracks: Track[]): void {
    this.current.update((current) => {
      if (current === none) {
        const first = tracks.shift();
        if (first) current = first;
      }

      this.queue.update((queue) => {
        queue.push(...tracks);
        this.updateAll({ current, queue });
        return queue;
      });

      return current;
    });
  }

  rearrage(index1: number, index2: number): void {
    this.queue.update((queue) => {
      const item = queue.splice(index1, 1)[0];
      queue.splice(index2, 0, item);
      this.updateAll({ queue });
      return queue;
    });
  }

  next(): void {
    this.queue.update((queue) => {
      const item = queue.shift();
      if (!item || item === none) return queue;

      this.current.update((current) => {
        if (current === none) return item;

        this.history.update((history) => {
          history.push(current);
          return history;
        });

        return item;
      });

      return queue;
    });
  }

  previous(): void {
    this.history.update((history) => {
      const item = history.pop();
      if (!item || item === none) return history;

      this.current.update((current) => {
        if (current === none) return item;

        this.queue.update((queue) => {
          queue.unshift(current);
          return queue;
        });

        return item;
      });

      return history;
    });
  }

  private updateAll({
    history = null as Track[] | null,
    current = null as Track | null,
    queue = null as Track[] | null,
  } = {}) {
    history = history ?? get(this.history);
    current = current ?? get(this.current);
    queue = queue ?? get(this.queue);
    this.all.set([...history, current, ...queue]);
  }
}

export interface Track {
  title: string;
  artists: string[];
  album: string;

  length: number;
  year?: number;
  cover?: string;
}

export enum Diretion {
  Normal,
  Backwards,
  Shuffled,
}

export enum Repeat {
  None,
  All,
  Single,
}
