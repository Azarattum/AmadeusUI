<script lang="ts">
  import type { ITrack } from "utils/track.interface";
  import { pannable } from "actions/pannable";
  import { spring } from "svelte/motion";
  import Miniplayer from "./miniplayer.svelte";

  let open = false;
  let paused = false;
  let time = 0;

  export let track: ITrack = {
    title: "Not Playing",
    artists: [],
    album: "",
    length: Infinity,
  };

  const offset = spring(0, {
    stiffness: 0.1,
    damping: 0.45,
  });
</script>

<div
  class="player"
  class:open
  use:pannable={{ offset }}
  on:open={() => (open = true)}
  on:close={() => (open = false)}
  style="transform: translateY({-$offset}px);"
>
  <Miniplayer bind:track bind:paused bind:time bind:hidden={open} />
</div>

<style lang="postcss">
  :global(.standalone) .player {
    bottom: calc(-1 * var(--view-height) + 98px);
  }
  .player {
    position: fixed;
    width: 100%;
    height: calc(var(--view-height) + 16px);
    bottom: calc(-1 * var(--view-height) + 77px);

    transition: 0.2s ease;
    transition-property: background-color, border-radius, box-shadow;
    background-color: var(--color-transparent);

    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }
  .player.open {
    background-color: var(--color-element);
    border-radius: 16px;
    pointer-events: all;
    box-shadow: 0px 0px 8px var(--color-shadow);
  }
</style>
