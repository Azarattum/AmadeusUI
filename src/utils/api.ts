import type Playlist from "models/playlist";
import type { Track } from "models/tracks";
import { shuffle, sleep } from "./utils";
import { samples } from "./samples";

export async function fetchLyrics(track: Track): Promise<string> {
  ///MOCKING FOR DEVELOPMENT PURPOSES ONLY!
  await sleep(4000 * Math.random());
  const lyrics = shuffle([...(track.title + " \n").repeat(70)]).join("");
  return lyrics;
}

export async function fetchRecent(): Promise<PlaylistInfo[]> {
  ///MOCKING FOR DEVELOPMENT PURPOSES ONLY!
  const played = new Promise<Playlist>((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Played",
        tracks: shuffle([...samples]),
        type: -2,
      });
    }, 2000 * Math.random() + 300);
  });
  const added = new Promise<Playlist>((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Added",
        tracks: shuffle(
          Array.from({ length: 4 }, () => samples.slice()).flat()
        ),
        type: -2,
      });
    }, 2000 * Math.random() + 300);
  });

  await sleep(300);
  return [
    { title: "Played", data: played },
    { title: "Added", data: added },
  ];
}

export async function fetchPlaylists(): Promise<PlaylistInfo[]> {
  ///MOCKING FOR DEVELOPMENT PURPOSES ONLY!
  const epic = new Promise<Playlist>((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Epic Music",
        tracks: shuffle([...samples]),
        type: -2,
      });
    }, 2000 * Math.random());
  });
  const calm = new Promise<Playlist>((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Calm Playlist",
        tracks: shuffle(
          Array.from({ length: 4 }, () => samples.slice()).flat()
        ),
        type: -2,
      });
    }, 2000 * Math.random());
  });
  const dance = new Promise<Playlist>((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Dancing",
        tracks: shuffle(
          Array.from({ length: 2 }, () => samples.slice()).flat()
        ),
        type: -2,
      });
    }, 2000 * Math.random());
  });

  await sleep(300);
  return [
    { title: "Epic Music", data: epic },
    { title: "Calm Playlist", data: calm },
    { title: "Dancing", data: dance },
  ];
}

interface PlaylistInfo {
  title: string;
  data: Promise<Playlist>;
}
