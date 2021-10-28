import { shuffle, sleep } from "./utils";
import type { ITrack } from "./track.interface";

export async function fetchLyrics(track: ITrack): Promise<string> {
  ///MOCKING FOR DEVELOPMENT PURPOSES ONLY!
  await sleep(4000);
  const lyrics = shuffle([...(track.title + " \n").repeat(70)]).join("");
  return lyrics;
}
