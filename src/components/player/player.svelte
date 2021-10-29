<script lang="ts">
  import type { Tracks } from "models/tracks";
  import { pannable } from "actions/pannable";
  import { onDestroy } from "svelte";

  import Miniplayer from "./miniplayer.svelte";
  import Coversel from "./coversel.svelte";
  import Playback from "./playback.svelte";
  import Slider from "./slider.svelte";
  import Info from "./info.svelte";

  export let tracks: Tracks;

  const current = tracks.current;
  let paused = true;
  let open = false;
  let time = 0;

  const currentUnsubscribe = tracks.current.subscribe(() => {
    time = 0;
  });

  onDestroy(() => {
    currentUnsubscribe();
  });
</script>

<div
  class="player"
  class:open
  use:pannable={{ handle: ".player-handle" }}
  on:open={() => (open = true)}
  on:close={() => (open = false)}
>
  <Miniplayer {tracks} bind:paused bind:time hidden={open} />
  <div class="container">
    <div class="player-handle" />
    <div>
      <Info title={$current.title} artists={$current.artists} />
      <Coversel {tracks} bind:paused />
    </div>
    <Playback bind:time length={$current.length} />
    <Slider {tracks} bind:paused bind:time />
  </div>
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
    transition-property: background-color, border-radius;
    background-color: var(--color-transparent);

    overflow: hidden;
    user-select: none;
    pointer-events: none;
    z-index: 1;

    &.open {
      border-radius: 16px;
      pointer-events: all;
      background-color: var(--color-element);
      box-shadow: 0px 0px 8px var(--color-shadow);

      .container {
        opacity: 1;
      }
    }
  }
  .container {
    position: absolute;
    top: 0;
    width: 100%;
    height: calc(var(--view-height) - 8px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    transition: 0.3s opacity ease;
    z-index: 10;
    opacity: 0;
  }
  .player-handle {
    position: relative;
    left: 50%;
    transform: translateX(-50%);

    margin: 12px 0 8px 0;
    width: 35px;
    height: 5px;
    border-radius: 5px;
    background-color: var(--color-text-caption);
    cursor: pointer;
  }
</style>
