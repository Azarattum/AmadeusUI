import "./dragable.d";
import { animateTo } from "utils/animation";
import { rigid, select } from "utils/haptics";

function childIndex(element: HTMLElement): number {
  return Array.prototype.indexOf.call(
    element.parentElement?.children || [],
    element
  );
}

function kebabize(str: string) {
  return str
    .split("")
    .map((letter, idx) => {
      return letter.toUpperCase() === letter
        ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}`
        : letter;
    })
    .join("");
}

export default function draggable(
  node: HTMLElement,
  { key }: { key: string }
): { destroy: () => void } {
  key += "DragIndex";
  let startPosition = [0, 0];
  let target: HTMLElement | null = null;
  let targetIndex: number | null = null;
  const transformed = new Map<HTMLElement, Animation>();

  let index = childIndex(node);
  let holder = node.parentElement;
  while (holder && holder.childElementCount <= 1) {
    index = childIndex(holder);
    holder = holder.parentElement;
  }
  node.dataset[key] = index.toString();

  let lastAnimated: number | null = null;
  let lastDirection: boolean | null = null;
  function applyAnimation(element: HTMLElement | number): number | null {
    if (lastAnimated == null) {
      throw new Error("Trying to apply an animation with no lastAnimated set!");
    }
    if (typeof element === "number") {
      const id = `[data-${kebabize(key)}="${element}"`;
      const found = document.querySelector<HTMLElement>(id);
      if (!found) return targetIndex;
      element = found;
    }

    const data = element.dataset[key];
    if (!data) {
      throw new Error(
        "Trying to apply an animation on a non draggable element!"
      );
    }
    const elementIndex = +data;
    if (!Number.isInteger(elementIndex)) return targetIndex;

    let direction = false;
    if (elementIndex > lastAnimated) direction = true;
    else if (elementIndex === lastAnimated) direction = !lastDirection;

    //Recursive safe animation guards
    if (lastDirection != direction && lastAnimated != elementIndex) {
      applyAnimation(lastAnimated);
    }
    if (lastAnimated != null && Math.abs(lastAnimated - elementIndex) > 1) {
      const last = Math.max(lastAnimated, elementIndex) - 1;
      applyAnimation(last);
    }
    if (elementIndex == index) return targetIndex;

    const modifier = index > elementIndex ? 1 : -1;
    const seen = transformed.has(element);
    const transform = !seen
      ? `translate3d(0,${modifier * (node.clientHeight + 1)}px,0)`
      : "translate3d(0,0,0)";
    const animation = animateTo(element, [{ transform }], {
      duration: 300,
      easing: "ease",
    });

    if (!seen) transformed.set(element, animation);
    else transformed.delete(element);

    lastDirection = direction;
    lastAnimated = elementIndex;

    return elementIndex + +seen * modifier;
  }

  function handleStart(event: TouchEvent) {
    const start = () => {
      rigid();
      node.dispatchEvent(new Event("scrollcancel", { bubbles: true }));

      lastAnimated = index;
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
      node.removeEventListener("touchforcechange", force as EventListener);
    };

    transformed.clear();
    node.addEventListener("touchmove", cancel, { passive: true, once: true });
    node.addEventListener("touchend", cancel, { passive: true, once: true });
    node.addEventListener("touchforcechange", force as EventListener);
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
      (x) => x != node && Number.isInteger(+(x.dataset[key] || NaN))
    );

    if (element == target) return;
    target = element as HTMLElement;

    if (target) {
      targetIndex = applyAnimation(target);
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
    lastDirection = null;
    lastAnimated = null;

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
