<script lang="ts">
  import type { Tracks } from "models/tracks";

  import Cover from "./cover.svelte";

  export let tracks: Tracks;
  export let paused: boolean;
  export let time: number;

  const current = tracks.current;

  export let hidden = false;
  let active = false;
</script>

<div
  class="miniplayer"
  class:hidden
  class:active
  on:touchstart={() => (active = true)}
  on:touchend={() => (active = false)}
>
  <div class="cover"><Cover image={$current.cover} /></div>
  <span class="title">{$current.title}</span>
  <button
    class:paused={!paused}
    aria-label="Pause/Play"
    on:touchstart|stopPropagation
    on:click|stopPropagation={() => (paused = !paused)}
  />
  <div class="playback" style="width:{(time / $current.length) * 100}%" />
</div>

<style lang="postcss">
  :global(.standalone) .miniplayer {
    height: 64px;
    border-bottom: solid 1px var(--color-highlight);

    .cover {
      height: 52px;
      width: 52px;
      margin: 0 16px 0 8px;
      border-radius: 4px;
      box-shadow: 0px 2px 6px var(--color-shadow);
    }
  }
  .miniplayer {
    z-index: -1;
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;

    backdrop-filter: blur(16px);
    background-color: var(--color-overlay);

    pointer-events: all;
    user-select: none;
    overflow: hidden;

    will-change: opacity;

    transition: 0.3s ease;
    transition-property: opacity, border-radius;
    &.hidden,
    &.active {
      background-color: var(--color-element);
    }
  }
  .cover {
    height: 48px;
    width: 48px;
    margin-right: 8px;
    background-color: var(--color-element);

    flex-shrink: 0;
    overflow: hidden;
  }
  span {
    width: 100%;
    pointer-events: none;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  button {
    --size: 35px;

    margin: 0 8px 0 8px;
    padding: 16px;
    background: transparent;
    border-radius: 100%;

    cursor: pointer;
    transition: 0.2s all ease-in-out;

    &:active {
      transition: 0.05s;
      transform: scale(0.8);
      background: var(--color-highlight);
    }

    &:before {
      display: block;
      content: "";
      box-sizing: border-box;
      padding: 0;
      transform: scale(0.6);
      height: var(--size);

      border-color: transparent transparent transparent var(--color-text-normal);
      transition: 0.3s all ease;

      border-style: solid;
      border-width: calc(var(--size) / 2) 0 calc(var(--size) / 2)
        calc(var(--size) / 1.2);
    }

    &.paused:before {
      border-style: double;
      border-width: 0 0 0 calc(var(--size) / 1.2);
    }
  }
  .playback {
    position: absolute;
    bottom: 0px;
    height: 2px;
    width: 0%;

    opacity: 0.5;
    border-radius: 2px;
    pointer-events: none;
    background-color: var(--color-text-caption);
  }
  .hidden {
    border-radius: 16px;
    pointer-events: none;
    opacity: 0;
  }
</style>
