<script lang="ts">
  import { Repeatition, Tracks } from "models/tracks";
  import { pannable } from "actions/pannable";
  import { onDestroy, onMount } from "svelte";
  import AudioPlayer from "models/audio";

  import Miniplayer from "./miniplayer.svelte";
  import Coversel from "./coversel.svelte";
  import Playback from "./playback.svelte";
  import Slider from "./slider.svelte";
  import Info from "./info.svelte";

  export let tracks: Tracks;

  let loading = false;
  let paused = true;
  let open = false;
  let time = 0;

  let player: AudioPlayer | undefined;

  const unsubscribe = tracks.subscribe(async () => {
    if (!player) return;
    try {
      if (!tracks.history.length) player.isPaused = false;
      await player.play(tracks.current);
      if (tracks.queue[0]) player.cache(tracks.queue[0]);
      else if (tracks.repeatition === Repeatition.All && tracks.history[0]) {
        player.cache(tracks.history[0]);
      }
    } catch (error) {
      console.log(error);
    }
  });

  $: if (paused) player?.pause();
  else player?.resume();
  $: player?.seek(time);

  function handlePaused() {
    if (!player) return;
    if (paused != player.isPaused) paused = player.isPaused;
    console.log("paused", paused);
  }
  function handleLoading() {
    if (!player) return;
    if (loading != player.isLoading) loading = player.isLoading;
    console.log("loading", loading);
  }
  function handleTime({ detail }: { detail: number }) {
    time = detail;
  }

  onMount(() => {
    player = new AudioPlayer();
    player.addEventListener("pausedchange", handlePaused);
    player.addEventListener("loadingchange", handleLoading);
    player.addEventListener("timeupdate", handleTime as any);
  });
  onDestroy(() => {
    player?.removeEventListener("pausedchange", handlePaused);
    player?.removeEventListener("loadingchange", handleLoading);
    player?.removeEventListener("timeupdate", handleTime as any);
    player?.destroy();
    unsubscribe();
  });
</script>

<div
  class="player"
  class:open
  use:pannable={{ handle: ".player-handle" }}
  on:open={() => (open = true)}
  on:close={() => (open = false)}
>
  <Miniplayer {tracks} {loading} bind:paused bind:time hidden={open} />
  <div class="container">
    <div class="player-handle" />
    <div>
      <Info title={$tracks.current.title} artists={$tracks.current.artists} />
      <Coversel {tracks} {loading} bind:paused />
    </div>
    <Playback bind:time length={$tracks.current.length} />
    <Slider {tracks} {loading} bind:paused bind:time />
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
    z-index: 1000;

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
