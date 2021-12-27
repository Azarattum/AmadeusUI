<script lang="ts">
  import tracks, { none } from "models/tracks";
  import { settings } from "models/settings";
  import { cloneArray } from "utils/utils";
  import playlists from "models/playlist";
  import { get } from "svelte/store";

  import Loader from "components/common/loader.svelte";
  import Cover from "./cover.svelte";

  export let paused: boolean;
  export let loading: boolean;
  export let time: number;

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
  <div class="cover"><Cover image={$tracks.current.cover} /></div>
  <span class="title">{$tracks.current.title}</span>
  {#if !loading}
    <button
      class:paused={!paused}
      aria-label="Pause/Play"
      on:touchstart|stopPropagation|passive
      on:click|stopPropagation={() => {
        if (tracks.current === none) {
          const playlist = $settings.defaultPlaylist;
          if (!playlist) return;
          const list = playlists.get(playlist);
          if (!list) return;
          const items = get(list.tracks);
          if (!items) return;
          tracks.pushPlaylist(cloneArray(items));
        } else paused = !paused;
      }}
    />
  {:else}
    <Loader size={30} padding={24} color={"var(--color-text-normal)"} />
  {/if}
  <div class="playback" style="--time: {time / $tracks.current.length};" />
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
    width: 100%;

    border-radius: 2px;
    pointer-events: none;
    background-color: var(--color-text-caption);

    opacity: 0.8;
    will-change: transform;
    transform-origin: left;
    transform: scaleX(var(--time));
  }
  .hidden {
    border-radius: 16px;
    pointer-events: none;
    opacity: 0;
  }
</style>
