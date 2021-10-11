import type { Spring } from "svelte/motion";

export function pannable(
  node: HTMLElement,
  { threshold = 32, gap = 8, clickable = true, offset }: PanOptions
): { destroy: () => void } {
  const styles = getComputedStyle(node);
  const bottom = parseFloat(styles.bottom);
  const height = parseFloat(styles.height);

  const target = innerHeight - bottom - height - gap;
  const { stiffness, damping } = offset;

  let opened = false;
  let open = false;
  let previous: number;

  offset.subscribe((x) => {
    if (x < 0 && offset.stiffness === 1) offset.set(0);
    if (x > target + gap && offset.stiffness === 1) offset.set(target + gap);
    if (!opened) {
      open = x > threshold;
      node.dispatchEvent(new CustomEvent(open ? "open" : "close"));
    } else {
      open = x >= target - threshold;
      if (!x) node.dispatchEvent(new CustomEvent("close"));
    }
  });

  function handleStart({ changedTouches: touches }: TouchEvent) {
    offset.stiffness = offset.damping = 1;
    previous = touches[0].clientY;

    addEventListener("touchmove", handleMove);
    addEventListener("touchend", handleEnd);
  }

  function handleMove({ changedTouches: touches }: TouchEvent) {
    const delta = previous - touches[0].clientY;
    previous = touches[0].clientY;
    offset.update((x) => x + delta);
  }

  function handleEnd() {
    offset.stiffness = stiffness;
    offset.damping = damping;

    if (open) {
      opened = true;
      offset.set(target);
    } else {
      opened = false;
      offset.set(0);
    }

    removeEventListener("touchmove", handleMove);
    removeEventListener("touchend", handleEnd);
  }

  function handleClick() {
    if (open) return;
    offset.set(target).then(() => {
      opened = true;
    });
  }

  if (clickable) node.addEventListener("click", handleClick);
  node.addEventListener("touchstart", handleStart);

  return {
    destroy() {
      if (clickable) node.removeEventListener("click", handleClick);
      node.removeEventListener("touchstart", handleStart);
    },
  };
}

export interface PanOptions {
  offset: Spring<number>;
  clickable?: boolean;
  threshold?: number;
  gap?: number;
}
