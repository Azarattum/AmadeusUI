<script lang="ts">
  import { Tracks } from "models/tracks";

  import Player from "components/player/player.svelte";
  import Library from "components/library.svelte";
  import Navbar from "components/navbar.svelte";

  const tracks = new Tracks();
  const tabs = [Library];
  let selected = 0;
</script>

{#each tabs as tab, i}
  {#if selected == i}
    <svelte:component
      this={tab}
      on:play={({ detail }) => tracks.play({ ...detail })}
    />
  {/if}
{/each}
<Player {tracks} />
<Navbar bind:selected />
