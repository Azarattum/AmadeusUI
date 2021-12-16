<script lang="ts">
  import expandable from "actions/expandable";
  import { fade } from "svelte/transition";

  let card: HTMLElement | undefined;
  export let title: string | Promise<String>;
  export let opened = false;

  const fadeOptions = {
    delay: typeof title === "string" ? 0 : 300,
    duration: typeof title === "string" ? 0 : 300,
  };

  $: if (opened) {
    card?.dispatchEvent(new Event("expand"));
  } else {
    card?.dispatchEvent(new Event("retract"));
  }
</script>

<article bind:this={card} use:expandable class:opened on:click>
  <div class="container">
    <div class="header">
      <h2>
        {#await title}
          <span class="loading" out:fade={{ duration: 300 }}>Loading...</span>
        {:then loaded}
          <span in:fade={fadeOptions}> {loaded} </span>
        {/await}
      </h2>
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

    height: 164px;
    overflow: hidden;
  }
  .container {
    transform-origin: center top;
    transition: var(--transition);
    transition-property: transform;
    position: absolute;
    top: 0;

    padding: 0 8px;
  }
  .header {
    position: relative;
    z-index: 1;

    display: flex;
    justify-content: space-between;
    margin: 4px 0;
    margin-bottom: -10px;
    transform: translateZ(1px);
    transition: var(--transition);
    transition-property: margin-top;

    &:before {
      position: absolute;
      display: block;
      content: "";
      height: 100%;
      width: 100%;
      margin-top: -16px;
      margin-left: -16px;
      padding: 16px;
      padding-bottom: 8px;

      z-index: -1;
      background: linear-gradient(
        180deg,
        var(--color-background) calc(100% - 8px),
        var(--color-transparent)
      );

      opacity: 0;
      transition: var(--transition);
      transition-property: opacity;
    }
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

    height: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
    .header {
      margin-top: 16px;
      &:before {
        opacity: 1;
      }
    }
  }
  .loading {
    display: block;
    animation: loading-text 2s ease-in-out infinite;
    font-family: "Blokk";
    font-size: 3rem;

    -webkit-background-clip: text;
    -webkit-text-fill-color: var(--color-text-caption);
    background-color: var(--color-text-caption);
  }

  @keyframes loading-text {
    50% {
      background-color: var(--color-text-normal);
      -webkit-text-fill-color: var(--color-text-normal);
    }
  }
</style>
