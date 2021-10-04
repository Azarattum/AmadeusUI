<script lang="ts">
  import Library from "components/library.svelte";
  import Navbar from "components/navbar.svelte";

  const tabs = [Library];
  let selected = 0;
</script>

{#each tabs as tab, i}
  {#if selected == i}
    <svelte:component this={tab} />
  {/if}
{/each}
<Navbar bind:selected />
