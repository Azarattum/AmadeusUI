<script lang="ts">
  import "actions/pannable.d";
  import type { ITrack } from "utils/track.interface";
  import { pannable } from "actions/pannable";
  import { spring } from "svelte/motion";
  import Miniplayer from "./miniplayer.svelte";

  let cover: HTMLDivElement;
  let open = false;
  let paused = false;
  let time = 0;

  export let track: ITrack = {
    title: "Not Playing",
    artists: [],
    album: "",
    length: Infinity,
  };

  const playerOffset = spring(0, { stiffness: 0.2 });
  const moreOffset = spring(0, { stiffness: 0.2 });

  function formatTime(x: number) {
    const minutes = ~~(x / 60);
    const seconds = (x - minutes * 60).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    if (!Number.isFinite(x)) return seconds;
    return `${minutes}:${seconds}`;
  }

  $: if (track.cover && cover) {
    cover.style.backgroundImage = `url(${track.cover})`;
  }
</script>

<div
  class="player"
  class:open
  use:pannable={{ offset: playerOffset }}
  on:open={() => (open = true)}
  on:close={() => (open = false)}
  style="transform: translateY({-$playerOffset}px);"
>
  <Miniplayer bind:track bind:paused bind:time bind:hidden={open} />
  <div class="container">
    <div class="info">
      <div class="title">{track.title}</div>
      <div class="artists">
        {#each track.artists as artist, i}
          <button class="artist" on:touchstart|stopPropagation|preventDefault>
            {artist + (i + 1 != track.artists.length ? "," : "")}
          </button>
        {/each}
      </div>
    </div>
    <div class="coversel">
      <div class="cover-prev" />
      <div bind:this={cover} class="cover" />
      <div class="cover-next" />
    </div>
    <div class="playback">
      <div class="progress" style="width:{(time / track.length) * 100}%">
        <div class="thumb" />
      </div>
      <div class="time">
        <button
          class="elapsed"
          on:touchstart|stopPropagation|preventDefault
          oncontextmenu={() => false}>{formatTime(time)}</button
        >
        <button
          class="left"
          on:touchstart|stopPropagation|preventDefault
          on:contextmenu={() => false}>{formatTime(track.length - time)}</button
        >
      </div>
    </div>

    <div
      class="more"
      use:pannable={{ offset: moreOffset, gap: 107 }}
      style="transform: translateY({-$moreOffset}px);"
    />
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
    opacity: 0;
  }
  .info {
    font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", "Helvetica",
      "Arial", sans-serif;
    padding: 16px;
  }
  .title {
    width: 100%;
    font-size: var(--font-normal);
    font-weight: bold;
    padding: 4px 2px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .artists {
    button {
      margin: 0;
      padding: 0;
      font-size: var(--font-little);
      color: var(--color-text-caption);
      padding: 4px 2px;
      border-radius: 8px;
      background-color: var(--color-transparent);
      transition: 0.3s ease;

      &:active {
        transition-duration: 0.05s;
        transform: scale(0.9);
        background-color: var(--color-highlight);
      }
    }
  }
  .coversel {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cover {
    background-size: cover;
    width: calc(100% - 64px);
    aspect-ratio: 1/1;
    background-color: var(--color-element);
    border-radius: 16px;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.2);
  }
  .playback {
    width: calc(100% - 24px * 2);
    margin: 32px 24px 48px 24px;
    height: 2px;
    border-radius: 2px;
    background: var(--color-text-caption);

    .progress {
      position: relative;
      top: -1px;
      height: 4px;
      background: var(--color-accent-75);
      border-radius: 4px;

      .thumb {
        position: absolute;
        right: 0;
        top: -12px;
        background: inherit;
        width: 8px;
        height: 16px;
        border-radius: 8px 8px 0 0;

        transition-property: transform;
        transition: 0.2s ease;
        transform: scale(1);
        &:active {
          transform-origin: bottom;
          transform: scale(1.3);
        }
      }
    }
  }
  .time {
    width: 100%;
    display: flex;
    justify-content: space-between;

    * {
      position: relative;
      padding: 4px 16px 10px 16px;
      margin: 0px -16px 0px -16px;

      border-radius: 8px;
      font-size: var(--font-little);
      transition: 0.2s all ease-in-out;

      &:active {
        transition-duration: 0.05s;
        background-color: var(--color-highlight);
      }
    }

    .left:before,
    .elapsed:before {
      display: block;
      content: "";
      border: solid var(--color-text-caption);
      border-width: 0 1px 1px 0;
      border-radius: 1px;
      display: inline-block;
      padding: 2px;
      margin-top: 4px;
    }
    .left:after,
    .elapsed:after {
      display: block;
      content: "";
      width: 100%;
      height: 1px;
      border-radius: 1px;
      margin-top: 3px;
      background-color: var(--color-text-caption);
    }
    .elapsed:before {
      float: left;
      margin-left: -4px;
      transform: translate(4px, 18px) rotateZ(135deg);
    }
    .left:before {
      float: right;
      margin-right: -4px;
      transform: translate(-4px, 18px) rotateZ(-45deg);
    }
  }
  .more {
    width: 100%;
    margin-bottom: calc(-1 * var(--view-height) + 45px);
    height: var(--view-height);
    bottom: calc(-1 * var(--view-height));

    background-color: var(--color-element);
    border-radius: 16px 16px 0 0;
    pointer-events: all;
    box-shadow: 0px 0px 8px var(--color-shadow);
  }
</style>
