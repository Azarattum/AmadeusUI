<script lang="ts">
  import { fade, scale } from "svelte/transition";

  import Loader from "components/common/loader.svelte";

  export let paused: boolean;
  export let loading: boolean;
</script>

<div class="container" class:paused={!paused && !loading} transition:fade>
  {#if !loading}
    <button
      class="pause"
      aria-label="Pause/Play"
      class:paused={!paused}
      on:click={() => (paused = !paused)}
      transition:scale
    />
  {:else}
    <div class="loader" transition:scale><Loader size={96} /></div>
  {/if}
</div>

<style lang="postcss">
  .container {
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
  }
  .loader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .pause {
    position: absolute;
    width: 100%;
    height: 100%;
    aspect-ratio: 1/1;

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
