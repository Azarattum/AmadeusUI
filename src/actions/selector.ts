import { select } from "utils/haptics";
import { toTouch } from "utils/mouse";

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
    parent?.addEventListener("touchcancel", handleEnd, { passive: false });
    parent?.addEventListener("touchmove", handleMove, { passive: false });
    parent?.addEventListener("touchend", handleEnd);
  }

  function handleClick() {
    target?.classList.remove("active");
    target = null;
  }

  function handleMouse(event: MouseEvent) {
    handleMove(toTouch(event));
  }

  node.addEventListener("touchstart", handleStart, { passive: false });
  node.addEventListener("mousemove", handleMouse, { passive: false });
  node.addEventListener("click", handleClick);
  return {
    destroy() {
      node.removeEventListener("touchstart", handleMove);
      node.removeEventListener("mousemove", handleMouse);
      node.removeEventListener("click", handleClick);
    },
  };
}
