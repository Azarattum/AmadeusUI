<script lang="ts">
  import { fetchRecent } from "utils/api";

  import Tabs from "./common/tabs.svelte";
  import Search from "./search.svelte";
  import Tracks from "./tracks.svelte";

  let sections = ["Recent", "Playlists", "Artists", "Albums"];
  let drag = 0;

  function onScroll({ target }: Event) {
    drag = (target as HTMLElement).scrollTop;
  }

  let recent = fetchRecent();
</script>

<Tabs {sections}>
  <Search slot="search" bind:drag />
  <section on:scroll={onScroll}>
    {#each Object.entries(recent) as [key, value]}
      <Tracks
        title={key.replace(/^\w/, (c) => c.toUpperCase())}
        tracks={value}
        on:play
      />
    {/each}
  </section>
  <section on:scroll={onScroll} />
  <section on:scroll={onScroll} />
  <section on:scroll={onScroll} />
</Tabs>
