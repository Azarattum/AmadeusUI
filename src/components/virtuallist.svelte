<script lang="ts">
  import { onDestroy } from "svelte";

  export let items: any[];
  export let viewport: HTMLElement;
  export let container: HTMLElement;
  export let itemHeight: number;

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

  let frame: number;
  function poll() {
    if (viewport && viewport.scrollTop !== scroll) {
      const maxScroll = items.length * itemHeight - containerHeight;
      let newScroll = viewport.scrollTop;

      if (newScroll < 0) newScroll = 0;
      else if (newScroll > maxScroll) newScroll = maxScroll;
      scroll = newScroll;
    }
    frame = requestAnimationFrame(poll);
  }

  function activate() {
    if (containerHeight || !viewport) return;
    containerHeight = viewport.offsetHeight;
    frame = requestAnimationFrame(poll);
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
  }

  onDestroy(() => {
    globalThis.cancelAnimationFrame?.(frame);
    observer?.disconnect();
  });
</script>

{#each visible as row (row.index)}
  <slot item={row.data} index={row.index} />
{/each}
