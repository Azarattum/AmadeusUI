import { shuffle, sleep } from "./utils";
import type { Track } from "models/tracks";

export async function fetchLyrics(track: Track): Promise<string> {
  ///MOCKING FOR DEVELOPMENT PURPOSES ONLY!
  await sleep(4000);
  const lyrics = shuffle([...(track.title + " \n").repeat(70)]).join("");
  return lyrics;
}
