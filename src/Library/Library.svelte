<script lang="ts">
  import { tick } from "svelte";

  let sections = ["Recent", "Playlists", "Artists", "Albums"];
  let active = 0;
  let header: HTMLElement;

  async function navigate(index: number) {
    active = index;
    await tick();
    focus();
  }

  function focus() {
    header.children[active].scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "start",
    });
  }
</script>

<header bind:this={header} tabIndex="-1" on:focusout={focus}>
  {#each sections as section, i}
    <button
      tabIndex={i + 1}
      class:active={active === i}
      on:click={() => navigate(i)}
      alt={section}
    >
      {section}
    </button>
  {/each}
</header>

<style>
  header {
    display: flex;
    justify-content: left;
    align-items: baseline;
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    outline: none;

    width: 100vw;
    cursor: pointer;
  }
  header::-webkit-scrollbar {
    display: none;
  }
  button {
    scroll-snap-align: start;
    font-size: var(--font-large);
    padding: 24px 8px 0 16px;
    color: var(--color-text-caption);
    transition: color 0.2s;
    height: 61px;
  }
  button:hover {
    color: var(--color-text-selected);
  }
  button::after {
    display: block;
    content: attr(alt);
    font-weight: bold;
    visibility: hidden;
    height: 24px;
  }
  button.active {
    font-weight: bold;
    color: var(--color-text-normal);
  }
  button:focus-visible {
    outline: none;
    text-decoration: underline;
  }
  @media (max-width: 600px) {
    button:last-child {
      padding-right: calc(100vw - 130px);
    }
  }
</style>
