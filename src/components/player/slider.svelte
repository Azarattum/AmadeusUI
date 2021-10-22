<script lang="ts">
  import { pannable } from "actions/pannable";
  import type { ITrack } from "utils/track.interface";
  import Lyrics from "./lyrics.svelte";
  import Queue from "./queue.svelte";

  export let current: ITrack;
  export let queue: ITrack[];

  let selected = 0;
  let open = false;
</script>

<div
  class="more"
  use:pannable={{ gap: 16, handle: ".handle-slider" }}
  on:open={() => (open = true)}
  on:close={() => (open = false)}
>
  <div class="handle-slider" class:open />
  <div class="mode" class:open>
    <button class="lyrics" on:touchstart={() => (selected = 0)} />
    <button class="queue" on:touchstart={() => (selected = 1)} />
  </div>
  <div class="content" class:open>
    <div style="display: {selected == 0 ? 'block' : 'none'}">
      <Lyrics {current} />
    </div>
    <div style="display: {selected == 1 ? 'block' : 'none'}">
      <Queue bind:current bind:queue />
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
  .handle-slider {
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
