<script lang="ts">
  import Search from "./search.svelte";
  import Tabs from "./tabs.svelte";

  let sections = ["Recent", "Playlists", "Artists", "Albums"];
  let container: HTMLElement;
  let drag = 0;

  function onScroll({ target }) {
    drag = target.scrollTop;
  }
</script>

<Tabs {sections}>
  <Search slot="search" bind:drag />
  {#each sections as section}
    <section on:scroll={onScroll}>
      {#each Array(10) as i}
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum
          aliquid, dolorum autem quasi consectetur adipisci officiis doloremque,
          suscipit numquam, odit illo. Tempora, excepturi debitis at quia
          similique fuga aliquid optio!
        </p>
      {/each}
    </section>
  {/each}
</Tabs>
