<script lang="ts">
  import { none, Track } from "models/tracks";
  import { formatTime } from "utils/time";

  import Cover from "./player/cover.svelte";

  export let track: Track = none;
  export let extra: "none" | "duration" = "none";
</script>

<div class="track" class:empty={track === none}>
  <Cover image={track.cover} size="48px" />
  <div class="info">
    <div class="title">{track.title}</div>
    <div class="artists">{track.artists.join(", ")}</div>
  </div>
  <div class="extra">
    {#if extra === "duration"}
      <div class="duration">{formatTime(track.length)}</div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .track {
    --height: 48px;
    position: relative;
    display: flex;
    overflow: visible;

    width: 100%;
    height: var(--height);

    & > :global(img) {
      border-radius: 6px;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    margin-left: 8px;
    width: 100%;
    max-width: calc(100% - var(--height) * 2 - 8px);

    * {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .extra {
    width: var(--height);
    height: var(--height);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .duration,
  .artists {
    font-size: var(--font-tiny);
    color: var(--color-text-caption);
  }
  .empty {
    animation: loading-text 2s ease-in-out infinite;
    font-family: "Blokk";
    -webkit-background-clip: text;
    -webkit-text-fill-color: var(--color-text-caption);
    background-color: var(--color-text-caption);

    :global(img) {
      background-color: var(--color-text-caption);
      animation: loading-text 2s ease-in-out infinite;
    }
  }

  @keyframes loading-text {
    50% {
      background-color: var(--color-text-normal);
      -webkit-text-fill-color: var(--color-text-normal);
    }
  }
</style>
