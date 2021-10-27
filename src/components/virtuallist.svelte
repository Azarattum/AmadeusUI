<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";

  export let items: any[];
  export let container: HTMLElement | null = null;
  export let itemHeight: number;

  let observer: IntersectionObserver | null = null;
  let containerHeight: number;
  let contents: HTMLElement;
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

  function update(..._: any[]) {
    if (!itemHeight || !container || !contents || !containerHeight) return;

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

  let frame: number;
  function poll() {
    if (container && container.scrollTop !== scroll) {
      const maxScroll = items.length * itemHeight - containerHeight;
      let newScroll = container.scrollTop;

      if (newScroll < 0) newScroll = 0;
      else if (newScroll > maxScroll) newScroll = maxScroll;
      scroll = newScroll;
    }
    frame = requestAnimationFrame(poll);
  }

  function activate() {
    if (containerHeight || !container) return;
    containerHeight = container.offsetHeight;
    frame = requestAnimationFrame(poll);
  }

  onMount(() => {
    container = container || (contents.parentElement as HTMLElement);
    if (!container) throw new Error("Virtual needs a vailid container!");

    //Activate component when becomes visible
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activate();
          observer?.disconnect();
        }
      },
      { root: container?.parentElement }
    );
    observer.observe(container);
  });

  onDestroy(() => {
    globalThis.cancelAnimationFrame?.(frame);
    observer?.disconnect();
  });
</script>

<div
  bind:this={contents}
  style="padding-top:{top}px; padding-bottom:{bottom}px;"
>
  {#each visible as row (row.index)}
    <slot item={row.data} index={row.index} />
  {/each}
</div>
