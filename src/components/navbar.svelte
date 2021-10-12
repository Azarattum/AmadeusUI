<script>
  const tabs = ["Library", "Listen", "Explore"];
  export let selected = 0;
</script>

<nav>
  {#each tabs as tab, i}
    <button
      tabindex="0"
      class={tab.toLowerCase()}
      class:active={selected === i}
      on:click={() => (selected = i)}
    >
      {tab}
    </button>
  {/each}
</nav>

<style lang="postcss">
  :global(.standalone) nav {
    height: 49px;

    button {
      padding: 2px 0 1px 0;
      font-size: var(--font-caption);

      &:before {
        position: relative;
        top: 1px;
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

    backdrop-filter: blur(16px);
    background: var(--color-overlay);
    border-top: solid 1px var(--color-highlight);
  }
  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--color-text-caption);
    padding: 6px 0 6px 0;
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

    &.library::before {
      mask-image: url("/icons/library.svg");
    }
    &.listen::before {
      mask-image: url("/icons/listen.svg");
    }
    &.explore::before {
      mask-image: url("/icons/explore.svg");
    }
  }
  button:before {
    display: block;
    content: "";
    height: 32px;
    width: 35px;
    background-color: var(--color-text-caption);

    mask: no-repeat 50% 50%;
    mask-size: 27px 27px;
    pointer-events: none;

    transition: inherit;
  }
  button.active {
    color: var(--color-accent-75);
    &::before {
      background-color: var(--color-accent-75);
    }
  }
</style>
