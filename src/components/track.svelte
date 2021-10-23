<script lang="ts">
  import { empty } from "utils/cover";
  import { formatTime } from "utils/time";
  import type { ITrack } from "utils/track.interface";

  export let track: ITrack;
  export let extra: "none" | "duration" = "none";
</script>

<div class="track" on:click>
  <img src={track.cover || empty} alt="" class="cover" loading="lazy" />
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
    height: var(--height);
    width: 100%;
    display: flex;
  }
  .cover {
    display: inline-block;
    border-radius: 8px;
    height: 100%;
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
