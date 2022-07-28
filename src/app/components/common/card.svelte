<script lang="ts">
  import { minmax } from "$utils/math";

  import { create_bidirectional_transition, run, tick } from "svelte/internal";

  import { animateTo } from "utils/animation";

  /// FATURES NEEDED
  ///  - scroll top on close
  ///  - optional title
  ///  - dynamic title bar (iOS style)
  ///    - support scroll to hide
  ///    - support top title bar to scroll top
  ///  - consider some kind of height calculation
  ///  - open on click by default (+blocking functionality)
  ///  - let:opened to slot
  ///  - use:autoscroll
  ///  - hide tabs when open

  let card: HTMLElement | undefined;
  let wrapper: HTMLElement | undefined;
  export let title: string;
  export let open = false;
  export let height: number;
  export let width: number;

  const duration = 300;

  // $: toggle(open);

  function ease(factor: number) {
    const { pow, atan, abs, sin, cos } = Math;
    // Magic formula https://www.desmos.com/calculator/kk5rybrxbp
    const angle = atan(factor);
    const length =
      pow(0.482 * atan(pow(abs(factor - 1) * 0.073, 0.687)), 0.95) + 0.443;

    const x1 = minmax(length * sin(angle), 0, 1);
    const y1 = length * cos(angle);
    const x2 = minmax(1 - y1, 0, 1);
    const y2 = 1 - x1;
    return `cubic-bezier(${x1}, ${y1}, ${x2},${y2})`;
  }

  async function toggle() {
    if (!card || !wrapper) return;

    open = !open;
    const before = card.getBoundingClientRect();
    await tick();
    const after = card.getBoundingClientRect();
    const w = before.width / after.width;
    const h = before.height / after.height;
    const x = before.width / 2 - after.width / 2 + before.x - after.x;
    const y = before.height / 2 - after.height / 2 + before.y - after.y;

    console.log(h);

    const transform = `translate3d(${x}px,${y}px,0) scale(${w}, ${h})`;
    card.animate(
      { transform, offset: 0 },
      { duration, easing: "ease", fill: "none" }
    );
    wrapper.animate(
      { transform: `scale(${1 / w}, ${1 / h})`, offset: 0 },
      {
        duration,
        easing: `cubic-bezier(${0.33}, ${0}, ${0.576},${1})`,
        fill: "none",
      }
    );
  }
</script>

<article
  class:open
  bind:this={card}
  on:click={() => toggle()}
  style:--duration="{duration}ms"
  style:height="{height}px"
  style:width="{width}px"
>
  <div bind:this={wrapper}>
    <h2>{title}</h2>
    <slot />
  </div>
</article>
<!-- ///Properly consider margin and width -->
<div style:height="{open ? height + 32 : 0}px" />

<style lang="postcss">
  @import "mixins.pcss";

  article {
    position: relative;
    /* transition: 1s linear; */
    /* transition-property: border-radius, background-color, transform; */

    overflow: hidden;
    contain: strict;
    /* will-change: transform; */
    /* transition-property: transform, border-radius; */
    /* transition-duration: 400ms; */
    /* transition-timing-function: ease; */

    /* /// REMOVE ACTUAL STYLING FROM HERE! */
    margin: 32px;
    box-shadow: 0px 0px 8px var(--color-shadow);
    border-radius: 8px;
    background-color: var(--color-element);

    z-index: 0;
    transition: z-index calc(2 * var(--duration)) linear;
    &.open {
      /* ///NEED TO COMPENSATE FOR position: absolute (to avoid reflow) */
      position: absolute;
      height: 100% !important;
      width: 100% !important;
      margin: 0 !important;
      border-radius: 0;
      left: 0;
      top: 0;

      transition: none;
      z-index: 1;
    }
  }
  div {
    /* transition: transform 0.3s linear; */
    /* overflow: auto; */
    /* transition: 1s linear; */
    transform-origin: top left;
    /* will-change: transform; */

    /* /// REMOVE ACTUAL STYLING FROM HERE! */
    /* padding: 16px; */

    & > * {
      transform: translate3d(0, 0, 0);
    }
  }

  h2 {
    margin-top: 0;
  }
  /*
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
  } */
</style>
