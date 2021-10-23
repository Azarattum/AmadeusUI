<script lang="ts">
  import { empty } from "utils/cover";
  import { fade } from "svelte/transition";
  import type { ITrack } from "utils/track.interface";
  import Options from "./options.svelte";

  export let track: ITrack;
  export let controls = false;
  export let paused = true;
</script>

<div class="container">
  <img src={track.cover || empty} alt="" class="cover" loading="lazy" />
  {#if controls}
    <button
      class="pause"
      aria-label="Pause/Play"
      class:paused={!paused}
      on:click={() => (paused = !paused)}
      transition:fade
    />
    <Options {paused} {track} />
  {/if}
</div>

<style lang="postcss">
  @import "../../styles/mixins.pcss";

  .container {
    width: calc(100% - 64px);
    position: relative;
    display: flex;

    background-size: cover;
    margin: 0 32px;

    &:before {
      float: left;
      padding-top: 100%;
      content: "";
    }
  }
  img {
    background-color: var(--color-background);
    border-radius: 16px;
    position: absolute;
    width: 100%;
  }
  .pause {
    width: 100%;
    height: 100%;
    aspect-ratio: 1/1;

    background-color: var(--color-glass);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    transition: 0.5s ease;
    transition-property: border-radius, opacity;

    &.paused {
      border-radius: 100%;
      opacity: 0;
    }

    &:after {
      --size: 64px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 0;

      border-color: transparent transparent transparent var(--color-text-normal);
      transition: 0.3s all ease;

      border-style: solid;
      border-width: calc(var(--size) / 2) 0 calc(var(--size) / 2)
        calc(var(--size) / 1.2);
    }

    &.paused:after {
      height: var(--size);
      border-style: double;
      border-width: 0 0 0 calc(var(--size) / 1.2);
    }
  }
</style>
