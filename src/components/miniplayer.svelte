<script lang="ts">
  import type { ITrack } from "utils/track.interface";

  export let hidden = false;
  export let paused = false;
  export let time = 0;

  export let track: ITrack = {
    title: "Not Playing",
    artists: [],
    album: "",
    length: Infinity,
  };
</script>

<div class="miniplayer" class:hidden>
  <div
    class="cover"
    style={track.cover ? `background-image: url(${track.cover})` : ""}
  />
  <span class="title">{track.title}</span>
  <div
    class="button"
    on:click|stopPropagation={() => (paused = !paused)}
    on:touchstart|stopPropagation
  >
    <button class:paused />
  </div>
  <div class="playback" style="width:{(time / track.length) * 100}%" />
</div>

<style lang="postcss">
  :global(.standalone) .miniplayer {
    height: 64px;

    .cover {
      min-height: 52px;
      min-width: 52px;
      border-radius: 4px;
      margin: 0 16px 0 8px;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.4);
    }
  }
  .miniplayer {
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;

    backdrop-filter: blur(16px);
    background-color: var(--color-overlay);

    pointer-events: all;
    user-select: none;
    overflow: hidden;

    transition: background-color 0.2s ease;
    &.hidden {
      background-color: var(--color-element);
    }
  }
  .cover {
    background-size: cover;
    min-height: 48px;
    min-width: 48px;
    margin-right: 8px;
    background-color: var(--color-element);

    pointer-events: none;
  }
  span {
    width: 100%;
    pointer-events: none;
  }
  .button {
    --size: 35px;

    height: var(--size);
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

    button {
      padding: 0;
      transform: scale(0.6);
      height: var(--size);

      border-color: transparent transparent transparent var(--color-text-normal);
      transition: 0.3s all ease;

      border-style: solid;
      border-width: calc(var(--size) / 2) 0 calc(var(--size) / 2)
        calc(var(--size) / 1.2);

      &.paused {
        border-style: double;
        border-width: 0 0 0 calc(var(--size) / 1.2);
      }
    }
  }
  .playback {
    position: absolute;
    bottom: 1px;
    height: 2px;
    width: 0%;

    opacity: 0.5;
    border-radius: 2px;
    pointer-events: none;
    background-color: var(--color-text-caption);
  }
</style>
