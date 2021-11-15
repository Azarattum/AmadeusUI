<script lang="ts">
  import Tabs from "./common/tabs.svelte";
  import Search from "./search.svelte";

  let sections = ["Recent", "Playlists", "Artists", "Albums"];
  let drag = 0;

  function onScroll({ target }: Event) {
    drag = (target as HTMLElement).scrollTop;
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
