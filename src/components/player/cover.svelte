<script lang="ts">
  import { empty } from "utils/cover";
  import { fade } from "svelte/transition";
  import Context from "components/context.svelte";

  export let img = "";
  export let controls = false;
  export let paused = true;
</script>

<div class="container">
  <img src={img || empty} alt="" class="cover" loading="lazy" />
  {#if controls}
    <button
      class="pause"
      aria-label="Pause/Play"
      class:paused={!paused}
      on:click={() => (paused = !paused)}
      transition:fade
    />

    <div transition:fade>
      <Context>
        <button
          slot="activator"
          class="options"
          aria-label="Show Options"
          class:active={false}
          class:paused
          on:touchstart|stopPropagation
        />
      </Context>
    </div>
  {/if}
</div>

<style lang="postcss">
  @import "../../styles/mixins.pcss";

  .container {
    width: calc(100% - 64px);
    position: relative;
    overflow: hidden;
    display: flex;

    background-color: var(--color-background);
    background-size: cover;
    border-radius: 16px;
    margin: 0 32px;

    &:before {
      float: left;
      padding-top: 100%;
      content: "";
    }
  }
  img {
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
    transform: scale(0.99999);

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
  .options {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 4px;

    width: 48px;
    height: 48px;
    backdrop-filter: blur(16px);
    border-bottom-right-radius: 16px;
    border-top-left-radius: 16px;
    background-color: var(--color-glass);

    &:before {
      icon: options 100%;
      transition: transform 0.2s ease;
      transition-duration: inherit;
    }

    transform-origin: bottom right;
    transition: 0.2s ease;
    transition-property: background, border-radius, transform;
    &.active {
      background-color: var(--color-overlay);
      border-top-left-radius: 0;
    }

    &.paused {
      background-color: var(--color-overlay);
    }
  }
</style>
