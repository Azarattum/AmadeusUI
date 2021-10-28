<script lang="ts">
  import type { Track } from "models/tracks";
  import { formatTime } from "utils/time";

  import Cover from "./player/cover.svelte";

  export let track: Track;
  export let extra: "none" | "duration" = "none";
</script>

<div class="track">
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
</style>
