<script lang="ts">
  import type { Track as ITrack } from "models/tracks";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import VirtualList from "components/common/virtuallist.svelte";
  import Card from "./common/card.svelte";
  import Track from "./track.svelte";

  const dispatch = createEventDispatcher();

  export let title: String;
  export let tracks: Promise<ITrack[]>;

  let opened = false;
  let loaded = false;
  $: if (!opened && viewport) viewport.scrollTo(0, 0);
  tracks.then(() => setTimeout(() => (loaded = true), 300));

  function formatDuration(seconds: number) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor((seconds % 3600) % 60);
    m += Math.round(s / 60);

    let hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes") : "";
    return hDisplay + mDisplay;
  }

  const itemHeight = 56;
  let viewport: HTMLElement;
  let container: HTMLElement;
</script>

<Card
  {title}
  bind:opened
  on:click={() => opened || !loaded || (opened = !opened)}
>
  <div class="viewport" bind:this={viewport} class:opened>
    {#await tracks}
      <div class="container" out:fade={{ duration: 300 }}>
        <div class="track"><Track /></div>
        <div class="track"><Track /></div>
      </div>
    {:then result}
      <div class="container" in:fade={{ delay: 300 }} bind:this={container}>
        <VirtualList
          items={result}
          {container}
          {itemHeight}
          {viewport}
          let:item={track}
        >
          <div
            class="track"
            on:click={(e) => {
              if (!opened) return;
              e.stopPropagation();
              dispatch("play", track);
            }}
          >
            <Track {track} on:play />
          </div>
        </VirtualList>
        <p>
          {result.length}
          {result.length == 1 ? "song" : "songs"}, {formatDuration(
            result.reduce((a, b) => a + b.length, 0)
          )}
        </p>
      </div>
    {/await}
  </div>
</Card>

<style lang="postcss">
  .viewport {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    height: calc(100vh - 92px);
    overflow-y: hidden;
    margin: 0 -16px;

    & > div {
      grid-row: 1;
      grid-column: 1;

      &:before {
        display: block;
        content: "";
        height: 10px;
      }

      &:after {
        display: block;
        content: "";
        height: 48px;
      }
    }
  }
  .container {
    padding: 0 16px;
  }
  .track {
    margin-top: 8px;

    :global(img) {
      cursor: pointer;
    }
  }
  .viewport.opened {
    overflow-y: auto;
    .track {
      cursor: pointer;
    }
  }
  :global(.standalone) .viewport > :global(div)::after {
    height: 116px;
  }
</style>
