import type { GretchInstance, GretchOptions } from "gretchen";
import type { Playlist } from "models/playlist";
import type { Track } from "models/tracks";
import { get, writable } from "svelte/store";
import { settings } from "models/settings";
import { stringify } from "models/tracks";
import { gretch } from "gretchen";
import { mock } from "./mock";

function request<T, U = unknown>(
  method: string,
  opts?: GretchOptions
): GretchInstance<T, U> {
  const { hostname, login, token } = get(settings);
  let base = `${hostname}/api/v1/${login}/`;
  if (!base.startsWith("http")) base = location.protocol + "//" + base;
  const params: RequestInit = {
    headers: { Authorization: token },
    mode: "cors",
    ...opts,
  };

  if (hostname === "demo") return mock(base + method, params);
  return gretch(base + method, params);
}

export async function fetchLyrics(track: Track): Promise<string> {
  const query = stringify(track);
  const { data } = await request<string>("lyrics/" + query).text();
  return data || "";
}

export async function fetchRecent(): Promise<Playlist[]> {
  const added = writable<Track[] | undefined>(undefined);
  const listened = writable<Track[] | undefined>(undefined);

  request("playlist/added")
    .json()
    .then(({ data }) => added.set(data as Track[]));
  request("playlist/listened")
    .json()
    .then(({ data }) => listened.set(data as Track[]));

  return [
    { id: 0, order: 0, type: 3, title: "Added", tracks: added },
    { id: 0, order: 1, type: 3, title: "Listened", tracks: listened },
  ];
}

export async function fetchPlaylists(): Promise<Playlist[]> {
  const { data } = await request("playlist").json();
  if (!Array.isArray(data)) return [];

  const playlists = data.map((x) => {
    const tracks = writable<Track[] | undefined>(undefined);

    request(`playlist/${x.id}`)
      .json()
      .then(({ data }) => tracks.set(data as Track[]));
    return {
      ...x,
      order: x.id,
      tracks,
    };
  });

  return playlists;
}

export async function fetchTrack(sources: string[]): Promise<string> {
  const source = sources[0];
  const { data } = await request<string>("track/" + source).text();
  return data || "";
}

export async function verifyLogin(password: string): Promise<boolean> {
  const { status } = await request("verify", {
    headers: { Authorization: password },
  })
    .flush()
    .catch(() => ({ status: 500 }));
  return status === 200;
}

export interface PlaylistInfo {
  title: string;
  data: Promise<Playlist>;
}
