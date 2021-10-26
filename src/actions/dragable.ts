import "./dragable.d";
import { animateTo } from "utils/animation";
import { rigid, select } from "utils/haptics";

function childIndex(element: HTMLElement): number {
  return Array.prototype.indexOf.call(
    element.parentElement?.children || [],
    element
  );
}

export default function draggable(
  node: HTMLElement,
  { container }: { container: HTMLElement }
): { destroy: () => void } {
  const transformed = new Map<HTMLElement, Animation>();
  const scrollThreshold = node.offsetHeight * 2;

  let bounds = { top: 0, bottom: innerHeight };
  let startPosition = [0, 0, 0];
  let target: HTMLElement | null = null;
  let targetIndex: number | null = null;

  let index = childIndex(node);
  let holder = node.parentElement;
  while (holder && holder.childElementCount <= 1) {
    index = childIndex(holder);
    holder = holder.parentElement;
  }
  if (node.dataset["dragIndex"] == null) {
    node.dataset["dragIndex"] = index.toString();
  }

  let lastAnimated: number | null = null;
  let lastDirection: boolean | null = null;
  let lastEvent: TouchEvent | null = null;
  function applyAnimation(element: HTMLElement | number): number | null {
    if (lastAnimated == null) {
      throw new Error("Trying to apply an animation with no lastAnimated set!");
    }
    if (typeof element === "number") {
      const id = `[data-drag-index="${element}"`;
      const found = container.querySelector<HTMLElement>(id);
      if (!found) return targetIndex;
      element = found;
    }

    const data = element.dataset["dragIndex"];
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

      const rect = container.getBoundingClientRect();
      bounds = { top: rect.top, bottom: rect.top + rect.height };
      lastAnimated = index;
      startPosition = [
        event.touches[0].clientX,
        event.touches[0].clientY,
        container.scrollTop,
      ];

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
    lastEvent = event;
    event.preventDefault();
    const { clientX, clientY } = event.touches[0];
    const normY = Math.min(Math.max(clientY, bounds.top), bounds.bottom - 1);
    const dx = clientX - startPosition[0];
    const dy = normY - startPosition[1];
    const ds = container.scrollTop - startPosition[2];
    node.style.transform = `translate3d(${dx}px, ${dy + ds}px, 0)`;

    const elements = document.elementsFromPoint(
      clientX,
      normY
    ) as HTMLElement[];
    const element = elements.find(
      (x) => x != node && Number.isInteger(+(x.dataset["dragIndex"] || NaN))
    );

    if (clientY - bounds.top < scrollThreshold) {
      startScroll(false);
    } else if (clientY > bounds.bottom - scrollThreshold) {
      startScroll(true);
    } else if (scrolling) {
      scrolling = false;
    }

    if (element == target) return;
    target = element as HTMLElement;

    if (target) {
      targetIndex = applyAnimation(target);
      select();
    }
  }

  let scrolling = false;
  function startScroll(direction: boolean) {
    if (scrolling) return;
    scrolling = true;
    const modifier = direction ? 1 : -1;
    const barrier = direction ? bounds.bottom : bounds.top;

    let then = Date.now();
    const scroll = () => {
      const y = lastEvent?.touches[0].clientY || 0;
      const rate = Math.pow(
        1 - (-modifier * (y - barrier)) / scrollThreshold,
        2
      );

      const elapsed = Date.now() - then;
      then = Date.now();

      container.scrollBy(0, (elapsed * modifier * rate) / 2);
      if (lastEvent) handleMove(lastEvent);
      if (scrolling) requestAnimationFrame(scroll);
    };
    scroll();
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
    lastEvent = null;
    scrolling = false;

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
