<script lang="ts">
  import type { Tracks } from "models/tracks";
  import { pannable } from "actions/pannable";

  import Lyrics from "./lyrics.svelte";
  import Queue from "./queue.svelte";

  export let tracks: Tracks;
  export let paused: boolean;
  export let loading: boolean;
  export let time: number;

  let selected = 0;
  let open = false;

  //The code below insures that "click" event will fire,
  //  it does not always fire in safari for some reason...
  let cancel: (() => void) | null = null;
  $: if (open) cancel?.();
  function select(index: number, target: EventTarget | null = null) {
    selected = index;
    if (!target) return;
    cancel = () => {
      target.removeEventListener("touchend", end);
      target.removeEventListener("touchcancel", end);
      cancel = null;
    };
    const end = () => {
      if (!cancel) return;
      cancel();
      target.dispatchEvent(new Event("click", { bubbles: true }));
    };
    target.addEventListener("touchend", end, { once: true });
    target.addEventListener("touchcancel", end, { once: true });
  }
</script>

<div
  class="more"
  use:pannable={{ gap: 16, handle: ".slider-handle" }}
  on:open={() => (open = true)}
  on:close={() => (open = false)}
>
  <div class="slider-handle" class:open />
  <div class="mode" class:open>
    <button
      class="lyrics"
      aria-label="Show Lyrics"
      on:touchstart={({ target }) => select(0, target)}
      on:mousedown={() => select(0)}
    />
    <button
      class="queue"
      aria-label="Open Queue"
      on:touchstart={({ target }) => select(1, target)}
      on:mousedown={() => select(1)}
    />
  </div>
  <div class="content" class:open>
    <div style="display: {selected == 0 ? 'block' : 'none'}">
      <Lyrics track={$tracks.current} />
    </div>
    <div style="display: {selected == 1 ? 'block' : 'none'}">
      <Queue {tracks} {loading} bind:time bind:paused />
    </div>
  </div>
</div>

<style lang="postcss">
  @import "../../styles/mixins.pcss";

  .more {
    z-index: 2;
    margin-bottom: calc(-1 * var(--view-height) + 45px);
    height: var(--view-height);

    background-color: var(--color-element);
    border-radius: 16px 16px 0 0;
    pointer-events: all;
    box-shadow: 0px 0px 8px var(--color-shadow);
  }
  .mode {
    position: absolute;
    height: 45px;
    width: 100%;
    display: flex;
    z-index: 1;

    button {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      &.lyrics:before {
        icon: lyrics 27px;
      }
      &.queue:before {
        icon: queue 24.75px;
      }

      &:before {
        opacity: 0.7;
        transition: opacity 0.5s ease;
      }
      &:active:before {
        transition-duration: 0.05s;
        opacity: 1;
      }
    }

    opacity: 1;
    transition: opacity 0.3s ease;
    &.open {
      opacity: 0;
      pointer-events: none;
    }
  }
  .content {
    position: relative;
    height: calc(100% - 64px);

    opacity: 0;
    transition: opacity 0.3s ease;
    &.open {
      opacity: 1;
    }

    div {
      height: 100%;
    }
  }
  .slider-handle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    margin: 12px 0 8px 0;
    height: 5px;
    width: 35px;
    border-radius: 5px;
    background-color: var(--color-text-caption);

    z-index: 1;
    cursor: pointer;

    opacity: 0;
    transition: opacity 0.3s ease;
    &.open {
      opacity: 1;
    }
  }
</style>
