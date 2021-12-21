<script lang="ts">
  import { Tracks, Track, Diretion } from "models/tracks";
  import { cloneArray } from "utils/utils";

  import Player from "components/player/player.svelte";
  import Library from "components/library.svelte";
  import Navbar from "components/navbar.svelte";

  const tracks = new Tracks();
  const tabs = [Library];
  let selected = 0;

  async function onPlaylist({ detail }: Playlist) {
    const index =
      detail.index ?? Math.floor(Math.random() * detail.tracks.length);

    tracks.clear();
    tracks.pushPlaylist(cloneArray(detail.tracks), index);
    if (detail.index == null) {
      tracks.direct(Diretion.Shuffled);
    }
  }

  function onQueueNext({ detail }: { detail: Track[] }) {
    tracks.pushNext(...cloneArray(detail));
  }

  function onQueueLast({ detail }: { detail: Track[] }) {
    tracks.pushLast(...cloneArray(detail));
  }

  interface Playlist {
    detail: { tracks: Track[]; index?: number };
  }
</script>

{#each tabs as tab, i}
  <section style="display:{selected == i ? 'block' : 'none'}">
    <svelte:component
      this={tab}
      on:playlist={onPlaylist}
      on:next={onQueueNext}
      on:last={onQueueLast}
    />
  </section>
{/each}
<Player {tracks} />
<Navbar bind:selected />
