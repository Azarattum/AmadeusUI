<script lang="ts">
  import { pannable } from "actions/pannable";

  export let open = false;
  $: if (open) panel?.click();
  else handle?.click();

  let panel: HTMLElement | undefined;
  let handle: HTMLElement | undefined;
</script>

<section
  use:pannable={{ gap: 16, handle: ".settings-handle" }}
  bind:this={panel}
  on:open={() => (open = true)}
  on:close={() => (open = false)}
  style="opacity: {+open}"
>
  <div class="settings-handle" bind:this={handle} on:click|stopPropagation />
  <h1>Settings</h1>
</section>

<style lang="postcss">
  section {
    position: fixed;
    bottom: calc(-1 * var(--view-height) - 16px);
    height: var(--view-height);

    background-color: var(--color-element);
    width: 100%;
    border-radius: 16px 16px 0 0;
    box-shadow: 0px 0px 8px var(--color-shadow);

    z-index: 2000;
  }
  .settings-handle {
    position: relative;
    left: 50%;
    transform: translateX(-50%);

    margin: 12px 0 8px 0;
    height: 5px;
    width: 35px;
    border-radius: 5px;
    background-color: var(--color-text-caption);

    cursor: pointer;
  }
</style>
