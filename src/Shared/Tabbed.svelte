<script lang="ts">
  import scrollIntoView from "scroll-into-view";

  export let sections = [];
  let active = 0;
  let header: HTMLElement;
  let tabs: HTMLElement;
  let scrolling = new Map<HTMLElement, number>();

  $: focus(active);
  async function focus(section = active) {
    if (!header) return;
    const props: __ScrollIntoView.Settings = {
      time: 200,
      align: { left: 0 },
      cancellable: true,
      validTarget: (x) => x === tabs || x === header,
    };

    async function scroll(node: HTMLElement) {
      const target = node.children[section] as HTMLElement;

      node.style.scrollSnapType = "none";
      scrolling.set(node, (scrolling.get(node) || 0) + 1);

      scrollIntoView(target, props, () => {
        scrolling.set(node, scrolling.get(node) - 1);
        if (!scrolling.get(node)) {
          const left = node.scrollLeft;
          node.style.scrollSnapType = null;
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
</script>

<header bind:this={header}>
  {#each sections as section, i}
    <button
      tabIndex={i + 1}
      class:active={active === i}
      on:click={() => (active = i)}
    >
      {section}
    </button>
  {/each}
</header>

<nav bind:this={tabs} on:scroll={update}>
  <slot />
</nav>

<style>
  header {
    display: flex;
    overflow: scroll hidden;
    scroll-snap-type: x mandatory;
    width: 100vw;

    transform: translateX(0);
    background: linear-gradient(
      180deg,
      var(--color-background) 88px,
      var(--color-transparent)
    );
  }
  button {
    scroll-snap-align: start;
    font-size: var(--font-large);
    padding: 16px 8px 0 14px;
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
    height: calc(100% - 86px);
  }
  nav > :global(*) {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    overflow-y: auto;
  }
  nav > :global(*)::before {
    display: block;
    content: "";
    height: 10px;
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
