<script lang="ts">
  import { fade } from "svelte/transition";

  let content: HTMLDivElement;
  export let img = "";
  export let main = false;
  export let paused = true;

  $: if (content && img) {
    content.style.backgroundImage = `url(${img})`;
  }
</script>

<div bind:this={content} class:main>
  {#if main}
    <button
      class="pause"
      class:paused={!paused}
      on:click={() => (paused = !paused)}
      transition:fade
    />
    <button
      class="options"
      class:paused
      on:touchstart|stopPropagation
      transition:fade
    />
  {/if}
</div>

<style lang="postcss">
  div {
    width: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    will-change: transform;

    background-color: var(--color-background);
    background-size: cover;
    border-radius: 16px;

    transition: 0.5s ease;
    transition-property: opacity, transform;
    transform: scale(0.8);
    opacity: 0.4;

    &.main {
      transform: scale(1);
      opacity: 1;
    }

    &:before {
      float: left;
      padding-top: 100%;
      content: "";
    }
  }
  .pause {
    width: 100%;
    height: 100%;
    aspect-ratio: 1/1;

    background-color: var(--color-glass);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    transition: all 0.3s ease;
    transform: scale(0.99999);

    &.paused {
      backdrop-filter: blur(0px);
      background-color: var(--color-transparent);
      border-radius: 100%;
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

    &:active {
      background-color: var(--color-glass);
      backdrop-filter: blur(16px);
      transition-duration: 0.05s;
      border-radius: 100%;
      transform: scale(0.8);
    }

    &:active:after {
      transition-duration: 0.05s;
      opacity: 1 !important;
    }

    &.paused:after {
      height: var(--size);
      border-style: double;
      border-width: 0 0 0 calc(var(--size) / 1.2);
      opacity: 0;
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
    border-bottom-right-radius: inherit;
    border-top-left-radius: inherit;
    background-color: var(--color-glass);

    &:before {
      display: block;
      content: "";
      width: 100%;
      height: 100%;
      border-radius: 100%;
      mask: url("icons/options.svg") no-repeat 50% 50%;
      mask-size: 100% 100%;

      background-color: currentColor;
      transition: transform 0.2s ease;
      transition-duration: inherit;
    }

    transform-origin: bottom right;
    transition: background 0.2s ease;
    &:active {
      transition-duration: 0.05s;
      background-color: var(--color-overlay);

      &:before {
        transform: scale(0.7);
      }
    }

    &.paused {
      background-color: var(--color-overlay);
    }
  }
</style>
