///MOCKING FOR DEVELOPMENT PURPOSES ONLY!
import type Playlist from "models/playlist";
import type { Track } from "models/tracks";
import { shuffle, sleep } from "./utils";
import { samples } from "./samples";

export async function fetchLyrics(track: Track): Promise<string> {
  await sleep(4000 * Math.random());
  const lyrics = shuffle([...(track.title + " \n").repeat(70)]).join("");
  return lyrics;
}

export async function fetchRecent(): Promise<PlaylistInfo[]> {
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

export async function fetchTrack(sources: string[]): Promise<string> {
  const source = parseInt(sources[0]);
  const urls = [
    "https://cs4-7v4.vkuseraudio.net/s/v1/acmp/HIIIwYw2lR3uJct2fPdyzycr_gvQ4zyibfLNigd_S8OcJ3h4eh5QdkgOWZfGx0ZkA3L3NvsKwtFbQWTcQVHpuZk2x1p6kevR-pLUNnlCRDMRbgn5jvFmbQ8jummcIDsrnkupR5LxGvIwAxAlHPhUPQx8oH-zIkVY2-STee8EU_-5iSFZ5Q.mp3",
    "https://s247vla.storage.yandex.net/get-mp3/e8304cc10650d57daf872feb79b8ede2/0005d36e130ce33a/rmusic/U2FsdGVkX18pfWYV6CjUQkWe6geMDf0QIWgCL5YlIPYYYYmLQLsOYmO3phvqYaJ-_fLN18m7y_dfSyQNs5gOMAUeytmjYM1toed8t0zU614/94b3c8cd10cb62205126c6298ef13d3571c689a90d9d489619a9fab15322c353",
    "https://cs4-2v4.vkuseraudio.net/s/v1/acmp/TrHNmV1LHxsHJMWEMxL_IPvjj6lS-_uLGETeRSp7wQSU5toR2wf2uAKl1lyiyDwk_fpKFlUreKdQ2lSJxHUp1qNAp8Xle4REUviIJIwjEA2qvqy7m0oyw9_otzbTt8YuIzfXCLMCJeldU8dgadlE5ynx4Crk-7BtX5uNPnfu2yvamv_fUw.mp3",
    "https://cs4-7v4.vkuseraudio.net/s/v1/acmp/RGCUlfUzyvhG9dgV5QMxG-w_O4r7Y5y1oW822DUsXG0Powu-1Y35lQ678AFn-H60C7IKjS4T-NRzdCP15tbTgOyBYpTdMMxwpmfIJ8bQAd54iK9hEnInNl_OSkcqt0tD-u1lNG7G0JXRL6n0xfM3zGiQiB_QhyUQP9SZTKt2JCXsbm6jKA.mp3",
    "https://s128iva.storage.yandex.net/get-mp3/ef5b403f6e91bc9ab002f164376342b0/0005d36e1690c2ab/rmusic/U2FsdGVkX18SNB7gb1fV9GSyo5j_BL-MY_ZeB9_IOUXwaIMTu9x28r-zLfmAvrOWpML5si-3_OK7CGuLQjldk1mKvXwg7B7vhkRZyqmFQpg/eee2cd22d0c7f4fd6e98d0b1561f01907e408d03767831ef6312ee261ec78252/39367",
    "https://psv4.vkuseraudio.net/s/v1/amp2/7oN-WKrwF69du3DoPeZISt-QRaHd5QnDd4x2BkGMSmEIBDu243aW-awN6T7e8tKSq5ZyPwboXgbv8oQWOosOBlRw_EjEGOcfSOQcNiTqqeVeC0jodWQ0iehrgBr9VKSHawvSDMrhRL1yeE724mrimHh4U-Dizcpl0q_X.mp3",
  ];

  await sleep(3000 * Math.random());
  return urls[source];
}

export interface PlaylistInfo {
  title: string;
  data: Promise<Playlist>;
}
