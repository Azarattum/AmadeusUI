import type { Track } from "./tracks";

export default interface Playlist {
  title: string;
  tracks: Track[];
  type: number;
  telegram?: number;
}
