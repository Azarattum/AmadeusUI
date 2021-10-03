<script lang="ts">
  import { isStandalone } from "../Utils/standalone";
  import { onMount } from "svelte";
  import Search from "./Search.svelte";
  import Tabs from "./Tabs.svelte";

  let sections = ["Recent", "Playlists", "Artists", "Albums"];
  let container: HTMLElement;
  let drag = 0;

  function onScroll({ target }) {
    drag = target.scrollTop;
  }

  onMount(() => {
    if (isStandalone) {
      container.style.marginTop = "33px";
    }
  });
</script>

<div class="container" bind:this={container}>
  <Tabs {sections}>
    <Search slot="search" bind:drag />
    {#each sections as section}
      <section on:scroll={onScroll}>
        {#each Array(10) as i}
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum
            aliquid, dolorum autem quasi consectetur adipisci officiis
            doloremque, suscipit numquam, odit illo. Tempora, excepturi debitis
            at quia similique fuga aliquid optio!
          </p>
        {/each}
      </section>
    {/each}
  </Tabs>
</div>

<style>
  .container {
    height: 100vh;
  }
</style>
