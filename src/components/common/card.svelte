<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let hidden = false;
  export let title: String;

  let open = false;

  $: if (open) dispatch("open");
  else dispatch("close");
</script>

<article class:open class:hidden on:click={() => (open = true)}>
  <h2>{title}</h2>
  <div>
    <slot />
  </div>
  <button
    aria-label="Show More"
    on:click|stopPropagation={() => (open = !open)}
  />
</article>

<style lang="postcss">
  @import "../../styles/mixins.pcss";

  article {
    --transition: 0.6s ease;

    margin: 16px 8px;
    padding: 16px;
    box-shadow: 0px 0px 8px var(--color-shadow);
    border-radius: 16px;
    background-color: var(--color-element);

    transition: var(--transition);
    transition-property: border-radius, margin, height, padding, max-height,
      background-color;

    overflow: hidden;
    max-height: 100vh;
    &.hidden {
      padding-top: 0;
      padding-bottom: 0;
      margin-top: 0;
      margin-bottom: 0;
      max-height: 0;
    }
  }
  h2 {
    transition: var(--transition);
    transition-property: font-size, padding-top;
    font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial,
      sans-serif;
    margin: 0;
    padding-bottom: 14px;
  }
  div {
    position: relative;
    max-height: 156px;
    overflow: hidden;

    transition: max-height var(--transition);
  }
  button {
    display: flex;
    justify-content: center;
    margin: 8px 0 -16px -16px;
    width: calc(100% + 32px);

    &:before {
      color: var(--color-text-caption);
      icon: down 2rem;

      transition: transform var(--transition);
    }
  }

  article.open {
    position: relative;
    background-color: var(--color-background);
    border-radius: 0;
    margin: 0;

    h2 {
      padding-top: 10px;
      font-size: var(--font-large);
    }
    div {
      max-height: 100vh;
    }
    button {
      &:before {
        transform: rotate(180deg);
      }
    }
  }
</style>
