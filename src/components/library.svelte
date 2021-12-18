<script lang="ts">
  import { fetchPlaylists, fetchRecent, PlaylistInfo } from "utils/mock";
  import { onMount } from "svelte";

  import Loader from "./common/loader.svelte";
  import Playlist from "./playlist.svelte";
  import Tabs from "./common/tabs.svelte";
  import Search from "./search.svelte";

  let sections = ["Recent", "Playlists", "Artists", "Albums"];
  let drag = 0;

  function onScroll({ target }: Event) {
    drag = (target as HTMLElement).scrollTop;
  }

  let recent = new Promise<PlaylistInfo[]>(() => {});
  let playlists = new Promise<PlaylistInfo[]>(() => {});
  onMount(() => {
    recent = fetchRecent();
    playlists = fetchPlaylists();
  });
</script>

<Tabs {sections}>
  <Search slot="search" bind:drag />
  <section on:scroll={onScroll}>
    {#await recent}
      <div class="loader">
        <Loader size={64} color="var(--color-text-caption)" />
      </div>
    {:then loaded}
      {#each loaded as info}
        <Playlist
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
      <div class="loader">
        <Loader size={64} color="var(--color-text-caption)" />
      </div>
    {:then loaded}
      {#each loaded as info}
        <Playlist
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
  .loader {
    position: relative;
    width: max-content;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 32px;
  }
</style>
