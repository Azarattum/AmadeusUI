import { spring } from "svelte/motion";

export function swipable(
  node: HTMLElement,
  { threshold = 20 }: SwipeOptions = {}
): { destroy: () => void } {
  const styles = getComputedStyle(node);
  const width = parseFloat(styles.width);
  const offset = spring(0);

  let previous: number;
  let current = 0;

  offset.subscribe((x) => {
    node.style.transform = `translateX(${-x * 100}%)`;
    if (x * width > threshold) current = 1;
    else if (x * width < -threshold) current = -1;
    else current = 0;
  });

  function handleStart(event: TouchEvent) {
    event.stopPropagation();
    const { changedTouches: touches } = event;
    offset.stiffness = offset.damping = 1;
    previous = touches[0].clientX;

    addEventListener("touchmove", handleMove);
    addEventListener("touchend", handleEnd);
  }

  function handleMove({ changedTouches: touches }: TouchEvent) {
    const delta = previous - touches[0].clientX;
    previous = touches[0].clientX;
    offset.update((x) => x + delta / width);
  }

  function handleEnd() {
    if (current === 1) node.dispatchEvent(new CustomEvent("swiperight"));
    if (current === -1) node.dispatchEvent(new CustomEvent("swipeleft"));

    offset.stiffness = 0.1;
    offset.set(0);

    removeEventListener("touchmove", handleMove);
    removeEventListener("touchend", handleEnd);
  }

  node.addEventListener("touchstart", handleStart);

  return {
    destroy() {
      node.removeEventListener("touchstart", handleStart);
    },
  };
}

export interface SwipeOptions {
  threshold?: number;
}
