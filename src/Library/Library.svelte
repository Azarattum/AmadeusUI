<script lang="ts">
  import { onMount } from "svelte";
  import Tabbed from "../Shared/Tabbed.svelte";

  let container: HTMLElement;
  const isStandalone =
    matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;

  onMount(() => {
    if (isStandalone) {
      container.style.marginTop = "33px";
    }
  });
</script>

<div class="container" bind:this={container}>
  <Tabbed sections={["Recent", "Playlists", "Artists", "Albums"]}>
    <section>1</section>
    <section>2</section>
    <section>3</section>
    <section>4</section>
  </Tabbed>
</div>

<style>
  .container {
    height: 100vh;
  }
</style>
