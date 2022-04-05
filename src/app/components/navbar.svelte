<script lang="ts">
  const tabs = ["Library", "Listen", "Explore"];
  export let selected = 0;
</script>

<nav>
  {#each tabs as tab, i}
    <button
      tabindex="0"
      aria-label={tab}
      class={tab.toLowerCase()}
      class:active={selected === i}
      on:click={() => (selected = i)}
    >
      {tab}
    </button>
  {/each}
</nav>

<style lang="postcss">
  @import "mixins.pcss";

  :global(.standalone) nav {
    height: 49px;

    button {
      padding: 8px 0 1px 0;
      font-size: var(--font-caption);

      &:before {
        position: relative;
        top: -1.5px;
      }
    }
  }
  nav {
    position: fixed;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    bottom: 0;
    height: 44px;
    width: 100vw;
    z-index: 900;

    backdrop-filter: blur(16px);
    background: var(--color-overlay);
    border-top: solid 1px var(--color-highlight);
  }
  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--color-text-caption);
    padding: 8px 0 8px 0;
    width: 128px;
    font-size: 0;

    border-radius: 8px;
    transition: color, background-color 0.2s ease;

    &:active {
      transition: 0s;
      color: var(--color-text-selected);
      background-color: var(--color-highlight);

      &::before {
        background-color: var(--color-text-selected);
      }
    }
    &:focus-visible {
      background-color: var(--color-highlight);
    }

    &:before {
      background-color: var(--color-text-caption);
      pointer-events: none;
      transition: inherit;
      transition: inherit;
    }
    &.library:before {
      icon: library 28px;
    }
    &.listen:before {
      icon: listen 28px;
    }
    &.explore:before {
      icon: explore 28px;
    }
  }
  button.active {
    color: var(--color-accent-75);
    &::before {
      background-color: var(--color-accent-75);
    }
  }
</style>
