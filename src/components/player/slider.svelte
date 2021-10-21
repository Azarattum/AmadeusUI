<script lang="ts">
  import { pannable } from "actions/pannable";
  import type { ITrack } from "utils/track.interface";
  import Lyrics from "./lyrics.svelte";
  import Queue from "./queue.svelte";

  export let current: ITrack;
  export let queue: ITrack[];

  const tabs = [
    { name: "lyrics", icon: "lyrics.svg", size: 60, component: Lyrics },
    { name: "queue", icon: "queue.svg", size: 55, component: Queue },
  ];
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
    {#each tabs as tab, i}
      <button
        class={tab.name}
        style={`-webkit-mask: url("/icons/${tab.icon}") no-repeat 50% 50%;` +
          `-webkit-mask-size: ${tab.size}% ${tab.size}%;`}
        on:touchstart={() => (selected = i)}
      />
    {/each}
  </div>
  <div class="content" class:open>
    {#each tabs as tab, i}
      <div style="display: {i == selected ? 'block' : 'none'}">
        <svelte:component this={tab.component} bind:current bind:queue />
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
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

      &:before {
        display: block;
        content: "";
        height: 45px;
        opacity: 0.7;
        background-color: var(--color-text-normal);

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
