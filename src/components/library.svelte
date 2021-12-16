<script lang="ts">
  import { fetchPlaylists, fetchRecent } from "utils/api";

  import Tabs from "./common/tabs.svelte";
  import Tracks from "./playlist.svelte";
  import Search from "./search.svelte";

  let sections = ["Recent", "Playlists", "Artists", "Albums"];
  let drag = 0;

  function onScroll({ target }: Event) {
    drag = (target as HTMLElement).scrollTop;
  }

  let recent = fetchRecent();
  let playlists = fetchPlaylists();
</script>

<Tabs {sections}>
  <Search slot="search" bind:drag />
  <section on:scroll={onScroll}>
    {#await recent}
      <div class="spinner" />
    {:then loaded}
      {#each loaded as info}
        <Tracks
          title={info.title}
          playlist={info.data}
          on:playlist
          on:next
          on:last
        />
      {/each}
    {/await}
  </section>
  <section on:scroll={onScroll}>
    {#await playlists}
      <div class="spinner" />
    {:then loaded}
      {#each loaded as info}
        <Tracks
          title={info.title}
          playlist={info.data}
          on:playlist
          on:next
          on:last
        />
      {/each}
    {/await}
  </section>
  <section on:scroll={onScroll} />
  <section on:scroll={onScroll} />
</Tabs>

<style lang="postcss">
  :global(.focused) section {
    overflow: hidden;
  }

  .spinner {
    position: relative;
    left: 50%;
    transform: translateX(-50%);

    color: var(--color-text-caption);
    opacity: 0.8;

    margin-top: 32px;
    width: 64px;
    height: 64px;

    &:after {
      content: " ";
      display: block;
      width: 32px;
      height: 32px;
      margin: 8px;
      border-radius: 50%;
      border: 6px solid currentColor;
      border-color: currentColor transparent currentColor transparent;
      animation: spinner-animation 1.2s linear infinite;
    }
  }

  @keyframes spinner-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
