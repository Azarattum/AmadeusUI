<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import Card from "./common/card.svelte";

  let focused = false;
  let results: any[] = [];

  const dispatch = createEventDispatcher();
</script>

<header>
  <h1>Explore</h1>
  <button
    aria-label="Settings"
    class="settings"
    on:click={() => dispatch("settings")}
  />
</header>

{#each results as result, i}
  <Card title="Result {i}" height={0} />
{/each}

<aside>
  <input
    type="text"
    placeholder="Search"
    tabindex="0"
    on:focus={() => (focused = true)}
    on:blur={() => (focused = false)}
  />
  <i class="search" />
  {#if focused}
    <button
      class="minimize"
      aria-label="Minimize Search"
      transition:fade={{ duration: 200 }}
    />
  {/if}
</aside>

<style lang="postcss">
  @import "../styles/mixins.pcss";

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .settings {
    box-sizing: content-box;
    padding: 8px;
    margin: 16px;
    border-radius: 8px;
    &:after {
      icon: settings 24px;
    }

    transition: background-color 0.3s ease;
    &:active {
      transition-duration: 0.05s;
      background-color: var(--color-highlight);
    }
  }

  aside {
    position: fixed;
    display: flex;
    width: 100%;
    bottom: 93px;
  }
  input {
    width: 100%;
    padding: 10px 35px;
    margin: 8px;
    background-color: var(--color-overlay);
    backdrop-filter: blur(16px);
  }
  i,
  .minimize {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  i {
    left: 16px;
    icon: search 18px;
    pointer-events: none;
    background-color: var(--color-text-caption);
  }

  :global(.standalone) aside {
    bottom: 114px;
  }
</style>
