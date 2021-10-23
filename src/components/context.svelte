<script lang="ts">
  import { selector } from "actions/selector";
  import { onDestroy, onMount } from "svelte";
  import { light } from "utils/haptics";

  export let align: "bottom right" = "bottom right";

  let open = false;
  let activator: HTMLElement | null = null;
  let context: HTMLElement | null = null;
  let menu: HTMLElement | null = null;

  function activate(event: Event) {
    if (open) return;
    event.preventDefault();
    light();
    open = true;
    activator?.classList.add("active");

    menu.dispatchEvent(new Event("touchstart"));
    addEventListener("click", deactivate, { passive: true, once: true });
  }

  function deactivate() {
    open = false;
    activator?.classList.remove("active");
  }

  onMount(() => {
    activator = context.lastElementChild as HTMLElement;
    if (!activator) return;

    activator.addEventListener("touchstart", activate);
    if (align === "bottom right") {
      menu.style.top = `${activator.offsetTop - menu.clientHeight}px`;
      menu.style.left = `${
        activator.offsetLeft - menu.clientWidth + activator.clientWidth
      }px`;
      menu.style.borderBottomRightRadius = "0";
    }
  });

  onDestroy(() => {
    activator?.removeEventListener("touchstart", activate);
  });
</script>

<div class="context" bind:this={context}>
  <div
    class="menu"
    use:selector
    bind:this={menu}
    style="transform-origin: {align}; transform: scale({open ? 1 : 0})"
  >
    <slot />
  </div>
  <slot name="activator" />
</div>

<style lang="postcss">
  @import "../styles/mixins.pcss";

  .menu {
    position: absolute;
    backdrop-filter: blur(16px);
    background-color: var(--color-overlay);

    min-width: 192px;
    width: min-content;
    height: min-content;
    border-radius: 10px;
    overflow: hidden;

    transition: transform 0.3s ease;
    :global(*) {
      padding: 10px;

      &:not(:nth-child(1)) {
        border-top: solid 1px var(--color-highlight-active);
      }
    }

    :global(.active) {
      background-color: var(--color-highlight-active);
      border-color: var(--color-transparent);
    }
    :global(.active + *) {
      border-color: var(--color-transparent);
    }
  }
</style>
