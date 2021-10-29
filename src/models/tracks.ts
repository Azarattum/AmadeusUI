import type { Readable, Writable } from "svelte/store";
import { writable, derived, get } from "svelte/store";
import { shuffle } from "utils/utils";

export const none: Track = {
  title: "Not Playing",
  artists: [],
  album: "",
  length: Infinity,
};

export class Tracks {
  private _current: Writable<Track> = writable(none);
  private _history: Writable<Track[]> = writable([]);
  private _queue: Writable<IndexedTrack[]> = writable([]);
  private _all: Writable<Track[]> = writable([]);
  private _direction: Writable<Diretion> = writable(Diretion.Normal);
  private _trackIndex = 0;

  repeat = Repeat.None;
  current: Readable<Track> = this._current;
  history: Readable<Track[]> = this._history;
  queue: Readable<Track[]> = this._queue;
  all: Readable<Track[]> = this._all;
  direction: Readable<Diretion> = this._direction;
  listened: Readable<number> = derived(
    this._history,
    (history) => history.length
  );

  pushNext(...tracks: Track[]): void {
    this._current.update((current) => {
      if (current === none) {
        const first = tracks.shift();
        if (first) current = first;
      }

      this._queue.update((queue) => {
        queue.unshift(...this.indexTracks(tracks, true));
        this.updateAll({ current, queue });
        return queue;
      });

      return current;
    });
  }

  pushLast(...tracks: Track[]): void {
    this._current.update((current) => {
      if (current === none) {
        const first = tracks.shift();
        if (first) current = first;
      }

      this._queue.update((queue) => {
        queue.push(...this.indexTracks(tracks));
        this.updateAll({ current, queue });
        return queue;
      });

      return current;
    });
  }

  rearrage(from: number, to: number): void {
    this._queue.update((queue) => {
      const item = queue.splice(from, 1)[0];
      const prevIndex = queue[to - 1]?.index ?? queue[to]?.index - 1;
      const nextIndex = queue[to]?.index ?? queue[to - 1]?.index + 1;
      item.index = (prevIndex + nextIndex) / 2;

      queue.splice(to, 0, item);
      this.updateAll({ queue });
      return queue;
    });
  }

  next(): void {
    let track: Track | undefined;
    this._queue.update((queue) => {
      const item = queue.shift();
      if (!item || item === none) return queue;

      this._current.update((current) => {
        if (current === none) return item;
        track = current;
        return item;
      });

      return queue;
    });

    if (track) this.pushHistory(track);
  }

  previous(): void {
    this._history.update((history) => {
      const item = history.pop();
      if (!item || item === none) return history;

      this._current.update((current) => {
        if (current === none) return item;

        this._queue.update((queue) => {
          queue.unshift(...this.indexTracks([current], true));
          const index = queue.indexOf(item as IndexedTrack);
          if (~index) {
            queue.splice(index, 1);
            this.updateAll({ history, current: item, queue });
          }
          return queue;
        });

        return item;
      });

      return history;
    });
  }

  switch(to: Track): void {
    let track: Track | undefined;
    this._current.update((current) => {
      track = current;

      this._queue.update((queue) => {
        const index = queue.indexOf(to as IndexedTrack);
        if (~index) queue.splice(index, 1);
        return queue;
      });

      return to;
    });

    if (track) this.pushHistory(track, to);
  }

  sort(direction: Diretion): void {
    if (direction == Diretion.Normal) {
      this._queue.update((queue) => {
        queue.sort((a, b) => a.index - b.index);
        this.updateAll({ queue });
        return queue;
      });
    }
    if (direction == Diretion.Backwards) {
      this._queue.update((queue) => {
        queue.sort((a, b) => b.index - a.index);
        this.updateAll({ queue });
        return queue;
      });
    }
    if (direction == Diretion.Shuffled) {
      this._queue.update((queue) => {
        shuffle(queue);
        this.updateAll({ queue });
        return queue;
      });
    }

    this._direction.set(direction);
  }

  clearHistory(): void {
    this._history.update(() => {
      this.updateAll({ history: [] });
      return [];
    });
  }

  private pushHistory(track: Track, remove?: Track): void {
    this._history.update((history) => {
      if (remove) {
        const index = history.indexOf(remove);
        if (~index) history.splice(index, 1);
      }
      history.push(...this.indexTracks([{ ...track }], true));
      return history;
    });

    if (this.repeat == Repeat.All) this.pushLast(track);
  }

  private updateAll({
    history = null as Track[] | null,
    current = null as Track | null,
    queue = null as Track[] | null,
  } = {}) {
    history = history ?? get(this._history);
    current = current ?? get(this._current);
    queue = queue ?? get(this._queue);
    this._all.set([...history, current, ...queue]);
  }

  private indexTracks(tracks: Track[], backwards = false): IndexedTrack[] {
    return tracks.map((x, i) => {
      (x as IndexedTrack).index = backwards
        ? -this._trackIndex++ + i * 2 - tracks.length + 1
        : this._trackIndex++;
      return x as IndexedTrack;
    });
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

interface IndexedTrack extends Track {
  index: number;
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
