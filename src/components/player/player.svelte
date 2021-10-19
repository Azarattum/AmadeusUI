<script lang="ts">
  import type { ITrack } from "utils/track.interface";
  import { pannable } from "actions/pannable";
  import Miniplayer from "./miniplayer.svelte";
  import Coversel from "./coversel.svelte";
  import Playback from "./playback.svelte";
  import Info from "./info.svelte";

  let paused = true;
  let open = false;
  let time = 0;

  export let queue: ITrack[] | null = [];
  export let current: ITrack = queue[0] || {
    title: "Not Playing",
    artists: [],
    album: "",
    length: Infinity,
  };

  $: currentChanged(current);
  const currentChanged = (_) => (time = 0);
</script>

<div
  class="player"
  class:open
  use:pannable={{ handle: ".handle" }}
  on:open={() => (open = true)}
  on:close={() => (open = false)}
>
  <Miniplayer bind:current bind:paused bind:time hidden={open} />
  <div class="container">
    <div class="handle" />
    <div>
      <Info title={current.title} artists={current.artists} />
      <Coversel bind:current bind:paused {queue} />
    </div>
    <Playback length={current.length} bind:time />
    <div class="more" use:pannable={{ gap: 16 }} />
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
    transition-property: background-color, border-radius, box-shadow;
    background-color: var(--color-transparent);

    overflow: hidden;
    user-select: none;
    pointer-events: none;
    z-index: 1;
  }
  .player.open {
    background-color: var(--color-element);
    border-radius: 16px;
    pointer-events: all;
    box-shadow: 0px 0px 8px var(--color-shadow);

    .container {
      opacity: 1;
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
  .handle {
    position: relative;
    left: 50%;
    transform: translateX(-50%);

    margin: 12px 0 8px 0;
    width: 35px;
    height: 5px;
    border-radius: 5px;
    background-color: var(--color-text-caption);
  }
  .more {
    z-index: 2;
    margin-bottom: calc(-1 * var(--view-height) + 45px);
    height: var(--view-height);

    background-color: var(--color-element);
    border-radius: 16px 16px 0 0;
    pointer-events: all;
    box-shadow: 0px 0px 8px var(--color-shadow);
  }
</style>
