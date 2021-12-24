<script lang="ts">
  import { Tracks, none } from "models/tracks";
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
  let speedup = NaN;
  let paused = true;
  let open = false;
  let time = 0;

  let player: AudioPlayer | undefined;

  let ended = false;
  const unsubscribe = tracks.subscribe(async () => {
    if (!player) return;
    try {
      //Autoplay options
      if (tracks.firstToPlay || ended || !paused) {
        player.isPaused = false;
        player.forcePlay = true;
        ended = false;
      }
      hadnleTitle(paused);
      await player.play(tracks.current);
      if (tracks.upcoming) player.cache(tracks.upcoming);
    } catch (error) {
      if (player.debug) console.log(error);
    }
  });

  $: if (paused) player?.pause();
  else player?.resume();
  $: player?.seek(time);
  $: handleSeek(speedup);
  $: hadnleTitle(paused);

  let title = "Amadeus";
  function hadnleTitle(paused: boolean) {
    if (!("document" in globalThis)) return;
    const track = tracks.current;
    if (paused || track === none) document.title = title;
    else document.title = `${track.artists.join(", ")} - ${track.title}`;
  }
  function handlePaused() {
    if (!player) return;
    if (player.isPaused && !paused && ended) return;
    if (paused != player.isPaused) paused = player.isPaused;
  }
  function handleLoading() {
    if (!player) return;
    if (loading != player.isLoading) loading = player.isLoading;
  }
  function handleEnd() {
    if (player && tracks.upcoming) {
      ended = true;
      tracks.next();
    }
  }
  function handleTime({ detail }: { detail: number }) {
    time = detail;
  }
  function handleNext() {
    if (player && tracks.upcoming) tracks.next();
  }
  function handlePrevious() {
    if (player && tracks.history.length) tracks.previous();
  }
  function handleSeek(speed: number) {
    if (paused) return;
    player?.speedup(Number.isNaN(speed) ? 1 : speed);
  }

  onMount(() => {
    title = document.title;
    player = new AudioPlayer();
    player.addEventListener("ended", handleEnd);
    player.addEventListener("next", handleNext);
    player.addEventListener("previous", handlePrevious);
    player.addEventListener("pausedchange", handlePaused);
    player.addEventListener("loadingchange", handleLoading);
    player.addEventListener("timeupdate", handleTime as any);
  });
  onDestroy(() => {
    player?.removeEventListener("ended", handleEnd);
    player?.removeEventListener("next", handleNext);
    player?.removeEventListener("previous", handlePrevious);
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
    <Playback bind:speedup bind:time length={$tracks.current.length} />
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
