<script lang="ts">
  import scrollIntoView from "scroll-into-view";

  export let sections: string[] = [];
  export let navigation = true;

  let active = 0;
  let tabs: HTMLElement;
  let header: HTMLElement;
  let scrolling = new Map<HTMLElement, number>();

  $: focus(active);
  async function focus(section = active) {
    if (!header) return;
    const props = {
      time: 200,
      align: { left: 0 },
      cancellable: true,
      validTarget: (x: HTMLElement) => x === tabs || x === header,
    };

    async function scroll(node: HTMLElement) {
      const target = node.children[section] as HTMLElement;

      node.style.scrollSnapType = "none";
      scrolling.set(node, (scrolling.get(node) || 0) + 1);

      scrollIntoView(target, props, () => {
        scrolling.set(node, (scrolling.get(node) || 0) - 1);
        if (!scrolling.get(node)) {
          const left = node.scrollLeft;
          (node as any).style.scrollSnapType = null;
          node.scrollTo(left, 0);
        }
      });
    }

    scroll(header);
    if (section != calcScrolled()) scroll(tabs);
  }

  function update() {
    const newTab = calcScrolled();
    if (!scrolling.get(tabs) && active != newTab) active = newTab;
  }

  function calcScrolled() {
    return Math.round(tabs.scrollLeft / tabs.clientWidth);
  }

  function navigate(index: number) {
    if (active === index) {
      scrollIntoView(tabs.children[active].firstElementChild as HTMLElement, {
        time: 200,
      });
    } else {
      active = index;
    }
  }
</script>

<header bind:this={header} class:hidden={!navigation}>
  {#each sections as section, i}
    <button
      tabIndex="0"
      class:active={active === i}
      on:click={() => navigate(i)}
      aria-label={section}
      alt={section}
    >
      {section}
    </button>
  {/each}
</header>

<slot name="search" />

<nav bind:this={tabs} on:scroll={update} class:hidden={!navigation}>
  <slot />
</nav>

<style lang="postcss">
  header {
    display: flex;
    overflow: scroll hidden;
    scroll-snap-type: x mandatory;
    width: 100vw;

    transform: translateX(0);
    background: linear-gradient(
      180deg,
      var(--color-background) calc(100% - 8px),
      var(--color-transparent)
    );

    transition: max-height 0.3s ease;
    max-height: 200px;
    &.hidden {
      max-height: 0px;
    }
  }
  button {
    font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", "Helvetica",
      "Arial", sans-serif;
    scroll-snap-align: start;
    font-size: var(--font-large);
    padding: 16px 8px 16px 16px;
    color: var(--color-text-caption);
    transition: color 0.2s;
    height: 64px;
  }
  button:hover {
    color: var(--color-text-selected);
  }
  button::after {
    display: block;
    content: attr(alt);
    font-weight: bold;
    visibility: hidden;
  }
  button.active {
    font-weight: bold;
    color: var(--color-text-normal);
  }
  button:focus-visible {
    text-decoration: underline;
  }
  nav {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 100%;

    overflow: auto hidden;
    scroll-snap-type: x mandatory;

    margin-top: -10px;
    height: var(--view-height);

    &.hidden {
      overflow: hidden;
    }
  }
  nav > :global(*) {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    overflow-y: auto;
  }
  nav > :global(*)::after {
    display: block;
    content: "";
    height: 144px;
  }
  :global(.standalone) nav > :global(*)::after {
    height: 196px;
  }
  *::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 600px) {
    button:last-child {
      padding-right: calc(100vw - 130px);
    }
  }
</style>
