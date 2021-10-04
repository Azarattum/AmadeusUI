<script lang="ts">
  import { fade } from "svelte/transition";
  export let drag;
  let query;
  let input: HTMLInputElement;
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
    bind:value={query}
    bind:this={input}
    on:focusout={() => {
      visible = false;
      query = "";
    }}
  />
  <i class="search" />
  {#if query}
    <i
      class="cancel"
      transition:fade={{ duration: 200 }}
      on:click={() => (query = "")}
    />
  {/if}
</div>

<style lang="postcss">
  div {
    position: absolute;
    display: flex;
    left: 50%;
    transform: translateX(-50%) scaleY(0);

    transition: transform 0.2s ease;
    margin-top: 8px;
    height: 38px;
    width: 80%;

    background-color: var(--color-element);
    border-radius: 10px;
    box-shadow: 0px 4px 8px var(--color-shadow);
  }
  div.visible {
    transform: translateX(-50%) scaleY(1);
  }
  input[type="text"] {
    width: 100%;
    max-height: 100%;
    padding: 7px 35px 7px 35px;
  }
  .search {
    left: 0;

    mask: url("/icons/search.svg") no-repeat 50% 50%;
    mask-size: 18px 18px;
    pointer-events: none;
  }
  .cancel {
    right: 0;

    mask: url("/icons/cancel.svg") no-repeat 50% 50%;
    mask-size: 16px 16px;
    cursor: pointer;
  }
  .cancel:hover {
    background-color: var(--color-text-selected);
  }
  i {
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 35px;
    width: 35px;

    background-color: var(--color-text-caption);
  }
</style>
