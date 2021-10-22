<script lang="ts">
  import { formatTime } from "utils/time";
  import type { ITrack } from "utils/track.interface";

  export let track: ITrack;
  export let extra: "none" | "duration" = "none";

  let cover: HTMLElement | null = null;
  $: if (cover && track.cover) {
    cover.style.backgroundImage = `url(${track.cover})`;
  }
</script>

<div class="track" on:click>
  <div class="cover" bind:this={cover}>
    <img
      alt=""
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    />
  </div>
  <div class="info">
    <div class="title">{track.title}</div>
    <div class="artists">{track.artists.join(", ")}</div>
  </div>
  <div class="extra">
    {#if extra === "duration"}
      <div class="duration">{formatTime(track.length)}</div>
    {/if}
    <img
      alt=""
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    />
  </div>
</div>

<style lang="postcss">
  .track {
    height: 48px;
    width: 100%;
    display: flex;
  }
  .cover {
    display: inline-block;
    border-radius: 8px;
    height: 100%;
    background-size: cover;

    img {
      display: block;
      height: 100%;
      width: auto;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
    max-width: calc(100% - 48px * 2 - 8px);
    margin-left: 8px;

    * {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .extra {
    position: relative;
    display: inline-block;
    height: 100%;

    img {
      display: block;
      height: 100%;
      width: auto;
    }

    *:not(img) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .duration,
  .artists {
    font-size: var(--font-tiny);
    color: var(--color-text-caption);
  }
</style>
