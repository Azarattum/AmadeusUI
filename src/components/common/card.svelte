<script lang="ts">
  import expandable from "actions/expandable";

  let card: HTMLElement | undefined;
  export let title: String;
  export let opened = false;

  $: if (opened) {
    card?.dispatchEvent(new Event("expand"));
  } else {
    card?.dispatchEvent(new Event("retract"));
  }
</script>

<article
  on:click={() => opened || (opened = !opened)}
  bind:this={card}
  use:expandable
  class:opened
>
  <div class="container">
    <div class="header">
      <h2>{title}</h2>
      <button
        class:hidden={!opened}
        aria-label="Minimize"
        on:click|stopPropagation={() => (opened = false)}
      />
    </div>
    <slot />
  </div>
</article>

<style lang="postcss">
  @import "../../styles/mixins.pcss";

  article {
    position: relative;
    --transition: 0.6s ease;

    margin: 16px 8px;
    box-shadow: 0px 0px 8px var(--color-shadow);
    border-radius: 8px;
    background-color: var(--color-element);

    transition: var(--transition);
    transition-property: border-radius, background-color, transform;

    height: 156px;
    overflow: hidden;
  }
  .container {
    transform-origin: center top;
    transition: var(--transition);
    transition-property: transform;

    padding: 0 8px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    margin: 4px 0;
  }
  h2 {
    display: inline-block;
    transition-property: font-size, padding-top;
    font-size: var(--font-large);
    font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial,
      sans-serif;
    margin: 0;

    transition: var(--transition);
    transition-property: transform;
    transform: scale(0.727272);
    transform-origin: left center;
  }
  button {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    margin: 8px;
    icon: cancel 24px;

    transition: 0.3s ease;
    color: var(--color-text-caption);
    &:active {
      transition-duration: 0.05s;
      color: var(--color-text-selected);
    }

    &.hidden {
      transition-duration: 0.5s;
      opacity: 0;
    }
  }
  article.opened {
    border-radius: 0;
    box-shadow: none;
    background-color: var(--color-background);

    h2 {
      transform: scale(1);
    }
  }
</style>
