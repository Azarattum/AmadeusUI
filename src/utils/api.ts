import type { GretchInstance, GretchOptions } from "gretchen";
import type Playlist from "models/playlist";
import type { Track } from "models/tracks";
import { settings } from "models/settings";
import { get } from "svelte/store";
import { gretch } from "gretchen";

function request<T, U = unknown>(
  method: string,
  opts?: GretchOptions
): GretchInstance<T, U> {
  const { hostname, login, password } = get(settings);
  const base = `${hostname}/api/v1/${login}/`;
  const params: RequestInit = {
    headers: { Authorization: password },
    mode: "cors",
    ...opts,
  };

  return gretch(base + method, params);
}

export async function fetchLyrics(track: Track): Promise<string> {
  const query = [track.artists.join(", "), track.title]
    .filter((x) => x)
    .join(" - ");

  const { data } = await request<string>("lyrics/" + query).text();
  return data || "";
}

export async function fetchRecent(): Promise<PlaylistInfo[]> {
  const added = request("added")
    .json()
    .then(({ data }) => ({
      title: "Added",
      type: -1,
      tracks: data as Track[],
    }));

  return [{ title: "Added", data: added }];
}

export async function fetchPlaylists(): Promise<PlaylistInfo[]> {
  const { data } = await request("playlist").json();
  if (!Array.isArray(data)) return [];

  const playlists = data.map((x) => ({
    title: x.title,
    data: new Promise<Playlist>((resolve, reject) => {
      if (!x?.id) resolve({ title: "None", type: -9999, tracks: [] });
      request("playlist/" + x.id)
        .json()
        .then(({ data, error }) => {
          if (error) return reject(error);
          resolve({
            title: x.title,
            type: x.type,
            telegram: x.telegram,
            tracks: data as Track[],
          });
        });
    }),
  }));

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
  }).flush();
  return status === 200;
}

export interface PlaylistInfo {
  title: string;
  data: Promise<Playlist>;
}
