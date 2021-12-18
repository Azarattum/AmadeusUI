///================
///WORK IN PROGRESS
///================

import type Playlist from "models/playlist";
import type { Track } from "models/tracks";

const url = "http://192.168.1.181:8003";
const username = "azarattum";
const base = url + "/api/v1/" + username;

export async function fetchLyrics(track: Track): Promise<string> {
  const query = [track.artists.join(", "), track.title]
    .filter((x) => x)
    .join(" - ");
  return await (await fetch(base + "/lyrics/" + query)).text();
}

export async function fetchRecent(): Promise<PlaylistInfo[]> {
  const added = fetch(base + "/added")
    .then((x) => x.json())
    .then((tracks) => ({
      title: "Added",
      type: -1,
      tracks: tracks,
    }));

  return [{ title: "Added", data: added }];
}

export async function fetchPlaylists(): Promise<PlaylistInfo[]> {
  const data = await (await fetch(base + "/playlist")).json();
  if (!Array.isArray(data)) return [];

  const playlists = data.map((x) => ({
    title: x.title,
    data: new Promise<Playlist>((resolve) => {
      if (!x?.id) resolve({ title: "None", type: -9999, tracks: [] });
      fetch(base + "/playlist/" + x.id)
        .then((x) => x.json())
        .then((tracks) => {
          resolve({
            title: x.title,
            type: x.type,
            telegram: x.telegram,
            tracks: tracks,
          });
        });
    }),
  }));

  return playlists;
}

export async function fetchTrack(sources: string[]): Promise<string> {
  const source = sources[0];
  return await (await fetch(base + "/track/" + source)).text();
}

export interface PlaylistInfo {
  title: string;
  data: Promise<Playlist>;
}
