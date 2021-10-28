<script lang="ts">
  import { fade } from "svelte/transition";

  import Context from "components/context.svelte";

  export let multiartist = false;
</script>

<div transition:fade>
  <Context>
    <button class="info" aria-label="Show Info">Info</button>
    {#if multiartist}
      <button class="artists" aria-label="Show Artists">Artists</button>
    {:else}
      <button class="artist" aria-label="Show Artist">Artist</button>
    {/if}
    <button class="album" aria-label="Show Album">Album</button>
    <button class="similar" aria-label="Find Similar">Similar</button>
    <button class="share" aria-label="Share Track">Share</button>
    <button class="save" aria-label="Save Track">Save</button>
    <button
      slot="activator"
      class="options"
      aria-label="Show Options"
      class:active={false}
      on:touchstart|stopPropagation
    />
  </Context>
</div>

<style lang="postcss">
  @import "../../styles/mixins.pcss";

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
  }

  button {
    display: block;
    font-size: unset;
    text-align: left;
    width: 100%;

    &:after {
      margin: -2px 4px -3px 4px;
    }
    --size: 24px;
    &.info:after {
      float: right;
      icon: info var(--size);
    }
    &.artist:after {
      float: right;
      icon: artist var(--size);
    }
    &.artists:after {
      float: right;
      icon: artists var(--size);
    }
    &.album:after {
      float: right;
      icon: album var(--size);
    }
    &.similar:after {
      float: right;
      icon: similar var(--size);
    }
    &.share:after {
      float: right;
      icon: share var(--size);
    }
    &.save:after {
      float: right;
      icon: save var(--size);
    }
  }
</style>
