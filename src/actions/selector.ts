import { select } from "utils/haptics";

export function selector(node: HTMLElement): { destroy: () => void } {
  let target: Element | null = null;

  function handleMove(event: TouchEvent) {
    event.preventDefault();

    const { clientY, clientX } = event.touches[0];
    let element = document.elementFromPoint(
      clientX,
      clientY
    ) as HTMLElement | null;
    if (!node.contains(element)) element = null;
    if (element === target) return;
    target?.classList.remove("active");
    target = element;
    target?.classList.add("active");
    if (target) select();
  }

  function handleEnd(event: TouchEvent) {
    event.preventDefault();

    const parent = node.parentElement;
    parent?.removeEventListener("touchcancel", handleEnd);
    parent?.removeEventListener("touchmove", handleMove);
    parent?.removeEventListener("touchend", handleEnd);
    (target as HTMLElement)?.click?.();
    target?.classList.remove("active");
    target = null;
  }

  function handleStart(event: TouchEvent) {
    event.preventDefault();

    if (node != event.target && node.contains(event.target as Element)) {
      target?.classList.remove("active");
      target = event.target as Element;
      target?.classList.add("active");
    }
    event.stopPropagation();

    const parent = node.parentElement;
    parent?.addEventListener("touchcancel", handleEnd);
    parent?.addEventListener("touchmove", handleMove);
    parent?.addEventListener("touchend", handleEnd);
  }

  node.addEventListener("touchstart", handleStart);
  return {
    destroy() {
      node.removeEventListener("touchstart", handleMove);
    },
  };
}
