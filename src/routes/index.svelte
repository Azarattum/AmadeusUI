<script lang="ts">
  import { Tracks, Track, Diretion } from "models/tracks";

  import Player from "components/player/player.svelte";
  import Library from "components/library.svelte";
  import Navbar from "components/navbar.svelte";

  const tracks = new Tracks();
  const tabs = [Library];
  let selected = 0;

  function onPlaylist({ detail }: Playlist) {
    const index =
      detail.index ?? Math.floor(Math.random() * detail.tracks.length);

    tracks.clear();
    tracks.pushPlaylist(detail.tracks, index);
    if (detail.index == null) {
      tracks.direct(Diretion.Shuffled);
    }
  }

  function onQueueNext({ detail }: { detail: Track[] }) {
    tracks.pushNext(...detail);
  }

  function onQueueLast({ detail }: { detail: Track[] }) {
    tracks.pushLast(...detail);
  }

  interface Playlist {
    detail: { tracks: Track[]; index?: number };
  }
</script>

{#each tabs as tab, i}
  {#if selected == i}
    <svelte:component
      this={tab}
      on:playlist={onPlaylist}
      on:next={onQueueNext}
      on:last={onQueueLast}
    />
  {/if}
{/each}
<Player {tracks} />
<Navbar bind:selected />
