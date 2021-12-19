<script lang="ts">
  import { onMount, tick, createEventDispatcher } from "svelte";
  import { animateTo } from "utils/animation";

  export let view: any[] = [];

  const center = 2;
  const dispatch = createEventDispatcher();

  let container: HTMLElement | undefined;
  let startPosition = [0, 0] as [number, number];
  let startTime = Date.now();
  let offset = 0;
  let scale = 1;
  let speed = 1;

  let runningAnimations: Animation[] = [];
  const animation = {
    duration: 200,
    easing: "ease",
  };

  let previous: any = null;
  $: if (view) handleUpdate();
  onMount(handleUpdate);

  async function handleUpdate() {
    await tick();
    if (!container) return;
    //This should fix a weird bug, when the
    // loop content is not being updated properly yet
    while (container.children.length > 5) {
      await new Promise(requestAnimationFrame);
    }
    if (!container) return;

    if (view[1] === previous) {
      container.style.transform = transform(offset - 1);
      animate(false, Math.max(speed, 0.8));
      speed = 1;
    } else if (view[3] === previous) {
      container.style.transform = transform(offset + 1);
      animate(false, Math.max(speed, 0.8));
      speed = 1;
    } else animate(true);

    previous = view[center];
  }

  function handleStart(event: TouchEvent) {
    const { clientX, clientY } = event.touches[0];
    startPosition = [clientX, clientY];
    startTime = Date.now();
    horizontal = false;
    offset = 0;
    speed = 1;

    animate(true);
    event.target?.addEventListener("touchmove", handleMove as EventListener);
    event.target?.addEventListener("touchend", handleEnd as any);
  }

  let horizontal = false;
  function handleMove(event: TouchEvent) {
    if (!container) return;
    event.stopPropagation();

    const { clientX, clientY } = event.touches[0];
    const angle =
      Math.atan2(startPosition[1] - clientY, startPosition[0] - clientX) /
      Math.PI;
    horizontal =
      horizontal || Math.abs(angle) < 0.3 || Math.abs(angle - 1) < 0.3;
    if (!horizontal) return handleEnd(event);

    const width = (event.target as HTMLElement)?.clientWidth;
    if (!width) return;

    offset = (startPosition[0] - clientX) / width;
    container.style.transform = transform(offset);

    const current = getCurrent();
    current.style.setProperty("opacity", `${1 - 0.2 * Math.abs(offset)}`);
    current.style.setProperty(
      "transform",
      `scale(${1 - (1 - scale) * Math.abs(offset)}) translateZ(1px)`
    );

    if (!offset) return;
    const target =
      (container.children[center + Math.sign(offset)] as HTMLElement) ||
      undefined;

    target?.style.setProperty("opacity", `${0.8 + 0.2 * Math.abs(offset)}`);
    target?.style.setProperty(
      "transform",
      `scale(${scale + (1 - scale) * Math.abs(offset)}) translateZ(1px)`
    );
  }

  async function handleEnd(event: TouchEvent) {
    event.target?.removeEventListener("touchmove", handleMove as EventListener);
    event.target?.removeEventListener("touchend", handleEnd as any);
    const { clientX, clientY } = event.changedTouches[0];
    const dist = distance(startPosition, [clientX, clientY]);
    speed = dist / (Date.now() - startTime);

    if (speed > 0.3) {
      if (offset > 0) next();
      else if (offset < -0) prev();
    } else {
      if (offset > 0.5) next();
      else if (offset < -0.5) prev();
    }

    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    if (!offset) return;
    animate(false, Math.max(speed, 0.8));
  }

  function next() {
    dispatch("next");
  }

  function prev() {
    dispatch("previous");
  }

  function distance([a, b]: [number, number], [c, d]: [number, number]) {
    return Math.sqrt((a - c) ** 2 + (b - d) ** 2);
  }

  function transform(offset = 0) {
    return `translate3d(calc(${-(center + offset) * 100}% - ${
      -(center + offset) * 64 - 32
    }px), 0, 0)`;
  }

  function getCurrent(): HTMLElement {
    return container?.children[center] as HTMLElement;
  }

  function animate(instant = false, speed?: number) {
    if (!container) return;
    const current = getCurrent();
    scale = 1 - 48 / current.clientWidth;
    runningAnimations.forEach((x) => x.cancel());
    runningAnimations = [];

    const active = {
      transform: "scale(1) translateZ(1px)",
      opacity: "1",
    };
    const passive = {
      transform: `scale(${scale}) translateZ(1px)`,
      opacity: "0.8",
    };

    const props = { ...animation };
    props.duration = speed ? animation.duration / +speed : animation.duration;

    if (instant) {
      container.style.transform = transform();
      (container.childNodes as NodeListOf<HTMLElement>).forEach((x) => {
        if (x === current) {
          for (const [key, value] of Object.entries(active)) {
            x.style.setProperty(key, value);
          }
        } else {
          for (const [key, value] of Object.entries(passive)) {
            x.style.setProperty(key, value);
          }
        }
      });
    } else {
      runningAnimations.push(
        animateTo(container, { transform: transform() }, props)
      );
      (container.childNodes as NodeListOf<HTMLElement>).forEach((x) => {
        if (x === current) {
          runningAnimations.push(animateTo(x, active, props));
        } else {
          runningAnimations.push(animateTo(x, passive, props));
        }
      });
    }

    offset = 0;
  }
</script>

<div class="swiper" bind:this={container} on:touchstart={handleStart}>
  {#each view as item, i (item)}
    <div
      on:click={() => {
        if (!item) return;
        if (i - center === 1) next();
        else if (i - center === -1) prev();
      }}
    >
      {#if item}
        <slot {item} position={i - center} />
      {/if}
    </div>
  {/each}
</div>

<style lang="postcss">
  .swiper {
    display: flex;
    overflow: visible;
    transform: translateZ(1px);

    * {
      width: calc(100% - 64px);
      flex-shrink: 0;
      padding: 24px;
      margin: -24px;
      transform: translateZ(1px);

      cursor: pointer;
    }

    *:nth-child(3) {
      padding: 0;
      margin: 0;
    }
  }
</style>
