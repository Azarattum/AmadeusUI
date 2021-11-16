import type { Track } from "models/tracks";
import { samples } from "./samples";
import { shuffle, sleep } from "./utils";

export async function fetchLyrics(track: Track): Promise<string> {
  ///MOCKING FOR DEVELOPMENT PURPOSES ONLY!
  await sleep(4000 * Math.random());
  const lyrics = shuffle([...(track.title + " \n").repeat(70)]).join("");
  return lyrics;
}

export function fetchRecent(): RecentTracks {
  ///MOCKING FOR DEVELOPMENT PURPOSES ONLY!
  const played = new Promise<Track[]>((resolve) => {
    setTimeout(() => {
      resolve(shuffle([...samples]));
    }, 2000 * Math.random());
  });
  const added = new Promise<Track[]>((resolve) => {
    setTimeout(() => {
      resolve(shuffle([...samples]));
    }, 1800 * Math.random());
  });

  return { played, added };
}

interface RecentTracks {
  played: Promise<Track[]>;
  added: Promise<Track[]>;
}
