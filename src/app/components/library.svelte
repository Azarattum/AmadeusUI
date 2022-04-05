<script lang="ts">
  import playlists from "models/playlist";

  import Loader from "./common/loader.svelte";
  import Playlist from "./playlist.svelte";
  import Tabs from "./common/tabs.svelte";
  import Search from "./search.svelte";

  let sections = ["Recent", "Playlists", "Artists", "Albums"];
  let drag = 0;

  function onScroll({ target }: Event) {
    drag = (target as HTMLElement).scrollTop;
  }

  const { recent, library, dynamic } = playlists;
</script>

<Tabs {sections}>
  <Search slot="search" bind:drag />
  <section on:scroll={onScroll}>
    {#if $recent}
      {#each $recent as playlist}
        <Playlist {playlist} />
      {/each}
    {:else}
      <div class="loader">
        <Loader size={64} color="var(--color-text-caption)" />
      </div>
    {/if}
  </section>
  <section on:scroll={onScroll}>
    {#if $library && $dynamic}
      {#each $library as playlist}
        <Playlist {playlist} />
      {/each}
      {#each $dynamic as playlist}
        <Playlist {playlist} />
      {/each}
    {:else}
      <div class="loader">
        <Loader size={64} color="var(--color-text-caption)" />
      </div>
    {/if}
  </section>
  <section on:scroll={onScroll} />
  <section on:scroll={onScroll} />
</Tabs>

<style lang="postcss">
  :global(.focused) section {
    overflow: hidden;
  }
  .loader {
    position: relative;
    width: max-content;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 32px;
  }
</style>
