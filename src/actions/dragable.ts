import "./dragable.d";
import { animateTo } from "utils/animation";
import { rigid, select } from "utils/haptics";

function childIndex(element: HTMLElement): number {
  return Array.prototype.indexOf.call(
    element.parentElement?.children || [],
    element
  );
}

export default function draggable(node: HTMLElement): { destroy: () => void } {
  let startPosition = [0, 0];
  let target: HTMLElement | null = null;
  let targetIndex: number | null = null;
  const transformed = new Map<HTMLElement, Animation>();

  let index = childIndex(node);
  let holder = node.parentElement;
  while (holder.childElementCount <= 1) {
    index = childIndex(holder);
    holder = holder.parentElement;
  }
  node.dataset["dragIndex"] = index.toString();

  function handleStart(event: TouchEvent) {
    const start = () => {
      rigid();
      node.dispatchEvent(new Event("scrollcancel", { bubbles: true }));

      startPosition = [event.touches[0].clientX, event.touches[0].clientY];
      addEventListener("touchmove", handleMove, { passive: false });
      addEventListener("touchend", handleEnd);
      node.classList.add("dragging");
    };

    const timeout = setTimeout(() => {
      cancel();
      start();
    }, 300);
    const force = ({ touches }: TouchEvent) => {
      if (touches[0].force > 0.1) {
        cancel();
        start();
      }
    };
    const cancel = () => {
      clearTimeout(timeout);
      node.removeEventListener("touchmove", cancel);
      node.removeEventListener("touchend", cancel);
      node.removeEventListener("touchforcechange", force);
    };

    transformed.clear();
    node.addEventListener("touchmove", cancel, { passive: true, once: true });
    node.addEventListener("touchend", cancel, { passive: true, once: true });
    node.addEventListener("touchforcechange", force);
  }

  function handleMove(event: TouchEvent) {
    event.preventDefault();
    const { clientX, clientY } = event.touches[0];
    const dx = clientX - startPosition[0];
    const dy = clientY - startPosition[1];
    node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

    const elements = document.elementsFromPoint(
      clientX,
      clientY
    ) as HTMLElement[];
    const element = elements.find(
      (x) => x != node && Number.isInteger(+x.dataset["dragIndex"])
    );

    if (element == target) return;
    target = element as HTMLElement;

    if (target) {
      const elementIndex = +element.dataset["dragIndex"];
      const modifier = index > elementIndex ? 1 : -1;
      const seen = transformed.has(target);

      const transform = !seen
        ? `translate3d(0,${modifier * (node.clientHeight + 1)}px,0)`
        : "translate3d(0,0,0)";
      const animation = animateTo(target, [{ transform }], {
        duration: 300,
        easing: "ease",
      });

      if (!seen) transformed.set(target, animation);
      else transformed.delete(target);

      targetIndex = elementIndex + +seen * modifier;
      select();
    }
  }

  function handleEnd() {
    node.style.transform = `none`;
    node.classList.remove("dragging");
    removeEventListener("touchmove", handleMove);
    removeEventListener("touchend", handleEnd);
    transformed.forEach((animation, element) => {
      animation.cancel();
      element.style.transform = "none";
    });
    transformed.clear();

    if (targetIndex == null || targetIndex == index) return;
    node.dispatchEvent(
      new CustomEvent("swap", { detail: { from: index, to: targetIndex } })
    );
  }

  node.addEventListener("touchstart", handleStart);
  return {
    destroy() {
      node.removeEventListener("touchstart", handleStart);
    },
  };
}
