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
    "https://cs4-2v4.vkuseraudio.net/s/v1/acmp/xFBN-OyxULYh63okSteHzc7Aat25_BUwmRjzkBugVqy38KRwuGCrtllsduRjxabpVULd1yv-3kX6w_XiDvsNw97-_cKEUHOxUgam8ooU7yEG4dTB3bos63-oqwcK8pqlhOHz4HtNZ68k9_1ziOA4LkJNVbpXk5MwoI5SVBoh6g2oF-VAIA.mp3",
    "https://cs4-2v4.vkuseraudio.net/s/v1/acmp/TrHNmV1LHxsHJMWEMxL_IPvjj6lS-_uLGETeRSp7wQSU5toR2wf2uAKl1lyiyDwk_fpKFlUreKdQ2lSJxHUp1qNAp8Xle4REUviIJIwjEA2qvqy7m0oyw9_otzbTt8YuIzfXCLMCJeldU8dgadlE5ynx4Crk-7BtX5uNPnfu2yvamv_fUw.mp3",
    "https://cs4-7v4.vkuseraudio.net/s/v1/acmp/RGCUlfUzyvhG9dgV5QMxG-w_O4r7Y5y1oW822DUsXG0Powu-1Y35lQ678AFn-H60C7IKjS4T-NRzdCP15tbTgOyBYpTdMMxwpmfIJ8bQAd54iK9hEnInNl_OSkcqt0tD-u1lNG7G0JXRL6n0xfM3zGiQiB_QhyUQP9SZTKt2JCXsbm6jKA.mp3",
    "https://cs4-1v4.vkuseraudio.net/s/v1/acmp/nbHB0OXEW_rq7JSyWb0JTRKmhVm1DqawP5u6wGi9kvAn3GBqAKBYTSLGSGL1a1IMG3BdAf7XencpOFIS6VrNjui5L_glo7bFudwvJieOmlPzqkd3W5BrW0mfbJbBWV9PJfd0B5Hj5MFZySY2lwvjE9ENz0Lhs4gI1dHMgG8zvsBEAKqfBg.mp3",
    "https://psv4.vkuseraudio.net/s/v1/amp2/7oN-WKrwF69du3DoPeZISt-QRaHd5QnDd4x2BkGMSmEIBDu243aW-awN6T7e8tKSq5ZyPwboXgbv8oQWOosOBlRw_EjEGOcfSOQcNiTqqeVeC0jodWQ0iehrgBr9VKSHawvSDMrhRL1yeE724mrimHh4U-Dizcpl0q_X.mp3",
  ];

  await sleep(3000 * Math.random());
  return urls[source];
}

export interface PlaylistInfo {
  title: string;
  data: Promise<Playlist>;
}
