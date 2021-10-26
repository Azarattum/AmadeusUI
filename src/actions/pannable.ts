import "./pannable.d";
import { spring } from "svelte/motion";
import { animateTo } from "utils/animation";

export function pannable(
  node: HTMLElement,
  { threshold = 32, gap = 8, clickable = true, handle }: PanOptions = {}
): { destroy: () => void } {
  const styles = getComputedStyle(node);
  const bottom = parseFloat(styles.bottom) || parseFloat(styles.marginBottom);
  const height = parseFloat(styles.height);

  const offset = spring(0, { stiffness: 0.2 });
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

    node.style.transform = `translate3d(0,${-x}px,0)`;
  });

  function handleStart(event: TouchEvent) {
    event.stopPropagation();
    const { changedTouches: touches } = event;
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

  function handleOpen() {
    if (open) return;
    node.dispatchEvent(new CustomEvent("open"));
    animateTo(node, [{ transform: `translate3d(0,${-target}px,0)` }], {
      duration: 300,
      easing: "ease",
    }).addEventListener("finish", () => {
      offset.stiffness = offset.damping = 1;
      offset.set(target);
      opened = true;
      offset.stiffness = stiffness;
      offset.damping = damping;
    });
  }

  function handleClose() {
    if (!open) return;
    animateTo(node, [{ transform: `translate3d(0,0px,0)` }], {
      duration: 300,
      easing: "ease",
    }).addEventListener("finish", () => {
      offset.stiffness = offset.damping = 1;
      offset.set(0);
      opened = false;
      offset.stiffness = stiffness;
      offset.damping = damping;
    });
  }

  node.addEventListener("touchstart", handleStart, { passive: true });
  if (clickable) node.addEventListener("click", handleOpen);
  if (handle) {
    node
      .querySelectorAll(handle)
      .forEach((x) => x.addEventListener("click", handleClose));
  }

  return {
    destroy() {
      node.removeEventListener("touchstart", handleStart);
      if (clickable) node.removeEventListener("click", handleOpen);
      if (handle) {
        node
          .querySelectorAll(handle)
          .forEach((x) => x.removeEventListener("click", handleClose));
      }
    },
  };
}

export interface PanOptions {
  clickable?: boolean;
  threshold?: number;
  handle?: string;
  gap?: number;
}
