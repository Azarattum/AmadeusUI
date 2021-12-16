<script lang="ts">
  import { fade } from "svelte/transition";

  export let drag: number;

  let input: HTMLInputElement;
  let query: string = "";
  let visible = false;
  let touched = false;

  $: if (touched && drag < -50) {
    visible = true;
  }
</script>

<svelte:window
  on:touchstart={() => (touched = true)}
  on:touchend={() => (touched = false) || (visible && input.focus())}
/>

<div class:visible>
  <input
    type="text"
    placeholder="Search"
    tabindex={visible ? 0 : -1}
    bind:value={query}
    bind:this={input}
    on:focusout={() => {
      visible = false;
      query = "";
    }}
  />
  <i class="search" />
  {#if query}
    <button
      class="cancel"
      aria-label="Close Search"
      transition:fade={{ duration: 200 }}
      on:click={() => (query = "")}
    />
  {/if}
</div>

<style lang="postcss">
  @import "../styles/mixins.pcss";

  div {
    position: absolute;
    display: flex;
    left: 50%;
    top: 64px;
    z-index: 2;
    transform: translateX(-50%) scaleY(0);

    transition: transform 0.2s ease;
    height: 38px;
    width: 80%;

    background-color: var(--color-element);
    border-radius: 10px;
    box-shadow: 0px 4px 8px var(--color-shadow);

    &.visible {
      transform: translateX(-50%) scaleY(1);
    }
  }
  input {
    width: 100%;
    padding: 7px 35px 7px 35px;
  }
  i,
  button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .search {
    left: 9px;
    icon: search 18px;
    pointer-events: none;
    background-color: var(--color-text-caption);
  }
  .cancel {
    height: 100%;
    width: 32px;
    right: 0;
    cursor: pointer;

    &:before {
      icon: cancel 16px;
      position: relative;
      left: 8px;
      background: var(--color-text-caption);
    }

    &:active:before {
      background-color: var(--color-text-selected);
    }
  }

  :global(.standalone) div {
    margin-top: 31px;
  }
</style>
