<script lang="ts">
  import Context from "components/context.svelte";
  import { fly, fade } from "svelte/transition";

  export let title: string;
  export let artists: string[] = [];
</script>

<div class="info">
  {#key title || artists}
    <div in:fly={{ y: 64 }} out:fade={{ duration: 200 }}>
      <div class="title">{title}</div>
      {#if artists.length > 1}
        <Context align="top">
          {#each artists as artist}
            <div class="artist">{artist}</div>
          {/each}
          <button
            slot="activator"
            class="artists"
            class:active={false}
            aria-label="Show Artists"
            on:touchstart|stopPropagation
          >
            {artists.join(", ")}
          </button>
        </Context>
      {:else}
        <button
          class="artists"
          aria-label="Show Artists"
          on:touchstart|stopPropagation
        >
          {artists.join(", ")}
        </button>
      {/if}
    </div>
  {/key}
</div>

<style lang="postcss">
  .info {
    font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", "Helvetica",
      "Arial", sans-serif;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    & > div {
      grid-row: 1;
      grid-column: 1;
      margin-bottom: 8px;

      display: flex;
      flex-direction: column;
      align-items: center;
    }

    :global(.context) {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  .title {
    width: calc(100% - 32px);
    font-size: var(--font-normal);
    font-weight: bold;
    text-align: center;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .artists {
    width: min-content;
    max-width: calc(100% - 32px);

    padding: 4px 8px;
    font-size: var(--font-little);
    color: var(--color-text-caption);
    border-radius: 4px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    transition: 0.3s ease;
    background-color: var(--color-transparent);

    &:active {
      transition-duration: 0.05s;
      background-color: var(--color-highlight);
      color: var(--color-accent-75);
    }

    &.active {
      background-color: var(--color-transparent);
      color: var(--color-text-caption);
      filter: blur(4px);
    }
  }
  .artist {
    text-align: center;
  }
</style>
