<script lang="ts">
  import { none, Track } from "models/tracks";
  import { scroller } from "actions/scroller";
  import { fade } from "svelte/transition";
  import { fetchLyrics } from "utils/mock";

  export let track: Track;
  $: lyrics = track !== none ? fetchLyrics(track) : "";
</script>

<h1>Lyrics</h1>
<div
  use:scroller={{ header: "h1", hider: ".slider-handle", dynamicHider: true }}
  class="text"
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
    class="slider-handle"
    style="display: none;"
    aria-label="Hide Lyrics"
  />
</div>

<style lang="postcss">
  @import "../../styles/mixins.pcss";

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
    overflow-y: scroll;
    word-break: break-word;
    max-height: calc(100% - 16px);
    white-space: pre-wrap;

    span:not(.loading) {
      user-select: auto;
    }

    &:before {
      display: block;
      content: "";
      height: 16px;
    }
  }
  .slider-handle {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 16px;
    margin-bottom: 32px;
    padding: 8px 24px;
    border-radius: 16px;

    background: var(--color-highlight);
    transition: background-color 0.3s ease;
    &:active {
      transition-duration: 0.05s;
      background: var(--color-highlight-active);
    }

    &:before {
      icon: down 32px;
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
