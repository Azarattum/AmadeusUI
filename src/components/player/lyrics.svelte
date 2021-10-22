<script lang="ts">
  import { fetchLyrics } from "utils/api";
  import { fade } from "svelte/transition";
  import scrollIntoView from "scroll-into-view";
  import type { ITrack } from "utils/track.interface";

  export let current: ITrack;
  let container: HTMLElement | null = null;
  let hider: HTMLButtonElement | null = null;

  let showHider = false;
  function updateHider(passthrough?: string) {
    globalThis.setTimeout?.(() => {
      showHider = container && container.scrollHeight > container.clientHeight;
    }, 500);
    return passthrough;
  }

  let touched = false;
  function onScroll({ target }) {
    if (hider && touched && target.scrollTop < -80) hider.click();
  }

  function scrollToTop() {
    if (!container) return;
    scrollIntoView(container.firstElementChild, {
      time: 200,
      align: { top: 0, topOffset: 64 },
    });
  }

  $: lyrics = (showHider = false) || fetchLyrics(current).then(updateHider);
</script>

<h1 on:click={scrollToTop}>Lyrics</h1>
<div
  bind:this={container}
  class="text"
  on:scroll={onScroll}
  on:touchstart={(e) => (touched = true) && showHider && e.stopPropagation()}
  on:touchend={() => (touched = false)}
>
  {#await lyrics}
    <span class="loading" out:fade={{ duration: 300 }}>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus
      veritatis laborum impedit placeat totam rem, esse, necessitatibus beatae
      nemo facere accusantium consectetur nostrum vero atque obcaecati soluta!
      Tenetur, iusto quia? Lorem ipsum dolor sit amet consectetur adipisicing
      elit. Maiores saepe debitis esse, recusandae molestiae minima perspiciatis
      ducimus vero officiis mollitia illum quidem!
    </span>
  {:then text}
    <span in:fade={{ delay: 300 }}>{text}</span>
  {/await}
  <button
    bind:this={hider}
    class="handle-slider"
    style="display: {showHider ? 'block' : 'none'}"
  />
</div>

<style lang="postcss">
  @import "../../styles/mixins.pcss";
  @font-face {
    font-family: "Blokk";
    src: url("/fonts/blokk.woff2") format("woff2");
    font-weight: normal;
    font-style: normal;
  }

  h1 {
    position: fixed;
    width: calc(100% - 16px);
    top: 16px;
    margin-left: 16px;
    padding-bottom: 8px;

    z-index: 2;
    background: linear-gradient(
      180deg,
      var(--color-element) calc(100% - 8px),
      var(--color-element-transparent)
    );
  }
  .loading {
    font-family: "Blokk";
    background-color: var(--color-text-normal);
    animation: loading-text 2s ease-in-out infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .text {
    padding: 16px;
    margin-top: 64px;
    max-height: calc(100% - 16px);
    overflow-y: scroll;

    span:not(.loading) {
      user-select: auto;
    }

    &:before {
      display: block;
      content: "";
      height: 16px;
    }
  }
  .handle-slider {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 16px;
    margin-bottom: 32px;
    padding: 16px;
    border-radius: 16px;

    background: var(--color-highlight);
    transition: background-color 0.3s ease;
    &:active {
      transition-duration: 0.05s;
      background: var(--color-highlight-active);
    }

    &:before {
      icon: hide 32px;
    }
  }

  @keyframes loading-text {
    0% {
      background-color: var(--color-text-caption);
    }
    50% {
      background-color: var(--color-text-normal);
    }
    100% {
      background-color: var(--color-text-caption);
    }
  }
</style>
