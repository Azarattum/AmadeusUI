<script lang="ts">
  import "actions/pannable.d";
  import "actions/swipable.d";
  import type { ITrack } from "utils/track.interface";
  import { pannable } from "actions/pannable";
  import { swipable } from "actions/swipable";
  import { slide, fade } from "svelte/transition";
  import { spring } from "svelte/motion";
  import { flip } from "svelte/animate";
  import { formatTime } from "utils/time";
  import Miniplayer from "./miniplayer.svelte";
  import Cover from "./cover.svelte";

  let open = false;
  let paused = true;
  let time = 0;

  export let trackNext: ITrack | null = null;
  export let trackPrev: ITrack | null = null;
  export let track: ITrack = {
    title: "Not Playing",
    artists: [],
    album: "",
    length: Infinity,
  };

  const playerOffset = spring(0, { stiffness: 0.2 });
  const moreOffset = spring(0, { stiffness: 0.2 });

  function next() {
    if (!trackNext) return;
    time = 0;
    trackPrev = track;
    track = trackNext;
    trackNext = null;
  }

  function prev() {
    if (!trackPrev) return;
    time = 0;
    trackNext = track;
    track = trackPrev;
    trackPrev = null;
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
    <div class="handle" />
    <div>
      {#key track}
        <div class="info" transition:slide>
          <div class="title">{track.title}</div>
          <button class="artists" on:touchstart|stopPropagation>
            {track.artists.join(", ")}
          </button>
        </div>
      {/key}
      <div
        class="coversel"
        use:swipable
        on:swiperight={next}
        on:swipeleft={prev}
      >
        {#each [trackPrev, track, trackNext] as x, i (x || i)}
          <div animate:flip={{ duration: 300 }} in:fade={{ delay: 300 }}>
            {#if x}
              <Cover bind:paused {...{ img: x.cover, main: x === track }} />
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="playback">
      <input
        class="progress"
        type="range"
        min="0"
        max={Number.isFinite(track.length) ? track.length : 0}
        style="--progress:{(time / track.length) * 100}%"
        bind:value={time}
        on:touchstart|stopPropagation
      />
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
      use:pannable={{ offset: moreOffset, gap: 62 }}
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
  .info {
    font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", "Helvetica",
      "Arial", sans-serif;
    padding-bottom: 8px;
    background: var(--color-element);
  }
  .title {
    width: calc(100% - 32px);
    margin: 0 16px 0 16px;
    font-size: var(--font-normal);
    font-weight: bold;
    padding: 4px 2px;
    text-align: center;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .artists {
    width: calc(100% - 32px);
    margin: -8px 16px 0 16px;
    text-align: center;
    padding: 0;
    font-size: var(--font-little);
    color: var(--color-text-caption);
    padding: 4px 2px;
    border-radius: 8px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    transition: 0.3s ease;
    background-color: var(--color-transparent);
    &:active {
      transition-duration: 0.05s;
      transform: scale(0.9);
      background-color: var(--color-highlight);
    }
  }
  .coversel {
    position: relative;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    div {
      will-change: transform;
      min-width: calc(100% - 64px);
      &:nth-child(2) {
        margin: 0 -10px 0 -10px;
        z-index: 1;
      }
    }
  }

  .playback {
    margin: 24px;

    .progress {
      -webkit-appearance: none;
      position: relative;
      pointer-events: none;
      z-index: 1;
      width: 100%;

      &::-webkit-slider-runnable-track {
        height: 4px;
        border-radius: 4px;
        background: linear-gradient(
              to right,
              var(--color-accent-50),
              var(--color-accent-75)
            )
            0 / var(--progress) 100% no-repeat,
          var(--color-text-caption);
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        position: relative;
        width: 32px;
        height: 32px;
        margin-top: -14px;
        border: none;
        border-radius: 100%;
        background: radial-gradient(
            circle,
            var(--color-accent-75),
            var(--color-accent-75) 20%,
            transparent 20%,
            transparent 100%
          )
          50% 50%;

        pointer-events: auto;
        transform: translateX(calc(var(--progress) - 50%));
        background-size: 100%;
        transition: background-size 0.3s ease;
      }

      &:active::-webkit-slider-thumb {
        background-size: 500%;
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

        &:before,
        &:after {
          transition-duration: 0.05s;
          opacity: 1;
        }
      }
    }

    *:before,
    *:after {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .left:before,
    .elapsed:before {
      position: absolute;
      display: block;
      content: "";
      border: solid currentColor;
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
      background-color: currentColor;
    }
    .elapsed:before {
      bottom: 8px;
      left: 16px;
      transform: rotateZ(135deg);
    }
    .left:before {
      bottom: 8px;
      right: 16px;
      transform: rotateZ(-45deg);
    }
  }
  .more {
    z-index: 2;
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
