import type { Readable, Writable } from "svelte/store";
import { fetchPlaylists, fetchRecent } from "utils/api";
import { get, derived } from "svelte/store";
import { writable } from "svelte/store";
import type { Track } from "./tracks";

export interface Playlist {
  id: number;
  type: number;
  title: string;
  order: number;
  tracks: Writable<Track[] | undefined>;
}

export class Playlists {
  recent = writable<Playlist[] | undefined>();
  library = writable<Playlist[] | undefined>();
  dynamic = writable<Playlist[] | undefined>();

  get loaded(): Readable<boolean> {
    return derived([this.recent, this.library, this.dynamic], (values) => {
      return values.every(Boolean);
    });
  }

  get(title: string): Playlist | undefined {
    return [get(this.recent), get(this.library), get(this.dynamic)]
      .flat()
      .filter(Boolean)
      .find((x) => x?.title === title);
  }

  load(): void {
    fetchRecent().then((x) => this.recent.set(x));
    fetchPlaylists().then((x) => {
      const library = [];
      const dynamic = [];
      for (const playlist of x) {
        if (playlist.type <= 0) library.push(playlist);
        else dynamic.push(playlist);
      }

      this.library.set(library);
      this.dynamic.set(dynamic);
    });
  }

  list(
    type: "library" | "dynamic" | "recent" | "all" = "all"
  ): Readable<string[]> {
    const stores =
      type === "all" ? [this.dynamic, this.library, this.recent] : [this[type]];

    return derived(stores, (values) => {
      if (!values) return [];
      return values
        .flatMap((x) => x?.map((y) => y.title) || "")
        .filter(Boolean);
    });
  }
}

const playlists = new Playlists();
export default playlists;
