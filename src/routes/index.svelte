<script lang="ts">
  import { settings } from "models/settings";
  import playlists from "models/playlist";

  import Player from "components/player/player.svelte";
  import Settings from "components/settings.svelte";
  import Library from "components/library.svelte";
  import Explore from "components/explore.svelte";
  import Listen from "components/listen.svelte";
  import Navbar from "components/navbar.svelte";

  const tabs = [Library, Listen, Explore];
  let selected = 0;
  let setup = !$settings.token;
  $: if ($settings.token) playlists.load();
</script>

{#each tabs as tab, i}
  <section style="display:{selected == i ? 'block' : 'none'}">
    <svelte:component this={tab} on:settings={() => (setup = true)} />
  </section>
{/each}
<Player />
<Navbar bind:selected />
<Settings bind:open={setup} />
