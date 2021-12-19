<script lang="ts">
  import { flip } from "svelte/animate";
  import { onDestroy } from "svelte";

  export let items: any[];
  export let viewport: HTMLElement;
  export let container: HTMLElement;
  export let itemHeight: number;
  export let flipping = 0;

  let observer: IntersectionObserver | null = null;
  let containerHeight: number;
  let scroll: number;

  const buffer = 2;
  let length = 0;
  let start = NaN;
  let end = 0;
  let top = 0;
  let bottom = 0;

  $: update(items, scroll);
  $: visible = items.slice(start, end).map((data, i) => {
    return { index: i + start, data };
  });
  $: container && (container.style.paddingTop = top + "px");
  $: container && (container.style.paddingBottom = bottom + "px");
  $: viewport && observe();

  let timeout: any;
  $: if (flipping && container) {
    clearTimeout(timeout);
    timeout = setTimeout(() => (flipping = 0), 300);
  }

  function update(..._: any[]) {
    if (!itemHeight || !viewport || !containerHeight) return;

    let newStart = ~~(scroll / itemHeight) - buffer;
    let newEnd =
      newStart + Math.ceil(containerHeight / itemHeight) + 1 + buffer * 2;
    if (newStart < 0) newStart = 0;
    if (newEnd > items.length) newEnd = items.length;

    if (start !== newStart) {
      start = newStart;
      top = start * itemHeight;
    }
    if (end !== newEnd) {
      end = newEnd;
      bottom = (items.length - end) * itemHeight;
    } else if (length != items.length) {
      bottom = (items.length - end) * itemHeight;
      length = items.length;
    }
  }

  let frame: number = 0;
  let timestamp: DOMHighResTimeStamp = 0;
  function poll(time: DOMHighResTimeStamp) {
    if (viewport && viewport.scrollTop !== scroll) {
      const maxScroll = items.length * itemHeight - containerHeight;
      let newScroll = viewport.scrollTop;

      if (newScroll < 0) newScroll = 0;
      else if (newScroll > maxScroll) newScroll = maxScroll;
      scroll = newScroll;
    }
    if (!time) return (frame = 0);
    if (!timestamp) timestamp = time;
    if (time - timestamp > 100) {
      timestamp = 0;
      frame = 0;
    } else frame = requestAnimationFrame(poll);
  }

  function startPolling() {
    if (!frame) frame = requestAnimationFrame(poll);
  }

  function activate() {
    if (containerHeight || !viewport) return;
    containerHeight = viewport.offsetHeight;
    poll(0);
    flipping = 0;
  }

  function observe() {
    //Activate component when becomes visible
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activate();
          observer?.disconnect();
        }
      },
      { root: viewport?.parentElement }
    );
    observer.observe(viewport);
    viewport.addEventListener("scroll", startPolling);
  }

  onDestroy(() => {
    viewport?.removeEventListener("scroll", startPolling);
    globalThis.cancelAnimationFrame?.(frame);
    observer?.disconnect();
  });
</script>

{#if !flipping}
  {#each visible as row (row.index)}
    <slot item={row.data} index={row.index} />
  {/each}
{:else}
  {#each visible as row (row.data)}
    <div animate:flip={{ duration: 300 }}>
      <slot item={row.data} index={row.index} />
    </div>
  {/each}
{/if}

<style>
  div {
    position: relative;
    transform: translate3d(0, 0, 0);
  }
</style>
