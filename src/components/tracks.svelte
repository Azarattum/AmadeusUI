<script lang="ts">
  import type { Track as ITrack } from "models/tracks";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import Card from "./common/card.svelte";
  import Track from "./track.svelte";

  const dispatch = createEventDispatcher();

  export let title: String;
  export let hidden: boolean;
  export let tracks: Promise<ITrack[]>;
</script>

<Card {title} {hidden} on:open on:close>
  <div class="container">
    {#await tracks}
      <div out:fade={{ duration: 300 }}>
        <div class="track"><Track /></div>
        <div class="track"><Track /></div>
        <div class="track"><Track /></div>
      </div>
    {:then result}
      <div in:fade={{ delay: 300 }}>
        {#each result as track}
          <div
            class="track"
            on:click|stopPropagation={() => dispatch("play", track)}
          >
            <Track {track} />
          </div>
        {/each}
      </div>
    {/await}
  </div>
</Card>

<style lang="postcss">
  .container {
    display: grid;
    grid-template-columns: minmax(0, 1fr);

    & > div {
      grid-row: 1;
      grid-column: 1;
    }
  }
  .track {
    margin-top: 4px;
  }
</style>
