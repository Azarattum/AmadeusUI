import "./draggable.d";
import { animateTo } from "utils/animation";
import { rigid, select } from "utils/haptics";

export default function draggable(
  node: HTMLElement,
  { scrollThreshold = 64, fixedOffset = 0, margin = 0 }: DraggableOptions = {}
): { destroy: () => void } {
  const registerStart = () => {
    node.addEventListener("touchstart", handleStart, {
      passive: true,
      once: true,
    });
  };

  let scrolling: number | undefined;
  let bounds = {
    top: 0,
    bottom: innerHeight,
  };

  let startPosition: [number, number, number] = [0, 0, 0];
  let lastPosition: [number, number] | null = null;
  let targetIndex: number | null = null;
  let startIndex: number | null = null;

  let puppet: HTMLElement | null = null;

  function findAll(): NodeListOf<HTMLElement> {
    return node.querySelectorAll<HTMLElement>("[data-index]");
  }

  function findElement(index: number | null): HTMLElement | null {
    if (index == null) return null;
    const id = `[data-index="${index}"`;
    return node.querySelector<HTMLElement>(id);
  }

  function getIndex(element: Element): number | null {
    const index = +((element as HTMLElement).dataset?.["index"] || NaN);
    if (!Number.isInteger(index)) return null;
    return index;
  }

  function applyAnimation() {
    findAll().forEach((x) => {
      const index = getIndex(x);
      if (index == null) return;
      if (targetIndex == null) return;
      if (startIndex == null) return;

      let transform = "translate3d(0,0,0)";
      if (index <= targetIndex && index > startIndex) {
        transform = `translate3d(0,calc(-100% - ${margin}px),0)`;
      } else if (index < startIndex && index >= targetIndex) {
        transform = `translate3d(0,calc(+100% + ${margin}px),0)`;
      }
      x.style.transform = transform;
    });
  }

  function createPuppet(from: HTMLElement) {
    const box = from.getBoundingClientRect();
    puppet = from.cloneNode(true) as HTMLElement;
    puppet.style.position = "fixed";
    puppet.style.zIndex = "0";
    puppet.style.left = box.left + "px";
    puppet.style.top = box.top - fixedOffset + "px";
    delete puppet.dataset["index"];

    node.appendChild(puppet);
    from.style.opacity = "0";

    requestAnimationFrame(() => {
      puppet?.classList.add("dragging");
    });
  }

  function destroyPuppet(): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (!puppet) return resolve();
      const source = findElement(startIndex);
      if (source) source.style.opacity = "1";
      const target = findElement(targetIndex);
      if (!target) {
        puppet.remove();
        puppet = null;
        return resolve();
      }

      target.style.opacity = "0";
      await new Promise((x) => requestAnimationFrame(x));
      const box = target.getBoundingClientRect();
      const position = {
        transform: `translate3d(${box.left - puppet.offsetLeft}px,${
          box.top - fixedOffset - puppet.offsetTop + scrollY
        }px,0)`,
      };

      puppet.classList.remove("dragging");
      const animation = animateTo(puppet, [position], {
        duration: 300,
        easing: "ease",
        fill: "none",
      });

      const final = () => {
        target.style.opacity = "1";
        requestAnimationFrame(() => {
          puppet?.remove();
          puppet = null;
          resolve();
        });
      };

      animation.oncancel = final;
      animation.onfinish = final;
      animation.onremove = final;
    });
  }

  function handleStart(event: TouchEvent) {
    const index = +((event.target as HTMLElement)?.dataset.index || NaN);
    if (!Number.isInteger(index)) return registerStart();

    const { clientX, clientY } = event.touches[0];
    const start = () => {
      const target = findElement(index);
      if (!target) return registerStart();
      const rect = node.parentElement?.getBoundingClientRect();
      if (!rect) return registerStart();

      node.dispatchEvent(new Event("scrollcancel", { bubbles: true }));

      createPuppet(target);
      startIndex = targetIndex = index;
      startPosition = [clientX, clientY, node.parentElement?.scrollTop || 0];
      lastPosition = [clientX, clientY];
      bounds = {
        top: Math.max(rect.top, bounds.top),
        bottom: Math.min(rect.top + rect.height, bounds.bottom),
      };

      addEventListener("touchend", handleEnd);
      event.target?.addEventListener("touchend", handleEnd);
      event.target?.addEventListener("touchcancel", handleEnd);
      event.target?.addEventListener("touchmove", handleMove as EventListener);
      rigid();
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
    const cancel = (event?: Event) => {
      clearTimeout(timeout);
      node.removeEventListener("touchmove", cancel);
      node.removeEventListener("touchend", cancel);
      node.removeEventListener("touchforcechange", force as EventListener);
      if (event) registerStart();
    };

    node.addEventListener("touchmove", cancel, { passive: true, once: true });
    node.addEventListener("touchend", cancel, { passive: true, once: true });
    node.addEventListener("touchforcechange", force as EventListener);
  }

  function handleMove(event?: TouchEvent) {
    if (!puppet || startIndex == null) return;
    if (!event && !lastPosition) return;

    const {
      clientX = lastPosition?.[0] || 0,
      clientY = lastPosition?.[1] || 0,
    } = event?.touches[0] || {};
    const normY = Math.min(Math.max(clientY, bounds.top), bounds.bottom - 1);
    lastPosition = [clientX, clientY];

    const dx = clientX - startPosition[0];
    const dy = normY - startPosition[1];
    const ds = (node.parentElement?.scrollTop || 0) - startPosition[2];
    puppet.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

    if (clientY - bounds.top < scrollThreshold) {
      startScroll(false);
    } else if (clientY > bounds.bottom - scrollThreshold) {
      startScroll(true);
    } else if (scrolling) {
      cancelAnimationFrame(scrolling);
      scrolling = undefined;
    }

    let index =
      startIndex + Math.round((dy + ds) / (puppet.offsetHeight + margin));
    if (index < 0) index = 0;
    if (index === targetIndex) return;
    if (!findElement(index)) return;
    targetIndex = index;

    applyAnimation();
    select();
  }

  async function handleEnd(event: Event) {
    event.target?.removeEventListener("touchmove", handleMove as EventListener);
    event.target?.removeEventListener("touchend", handleEnd);
    event.target?.removeEventListener("touchcancel", handleEnd);
    removeEventListener("touchend", handleEnd);
    findAll().forEach((x) => {
      const transition = x.style.transition;
      x.style.transition = "none";
      x.style.transform = "none";
      requestAnimationFrame(() => {
        x.style.transition = transition;
      });
    });

    if (scrolling) cancelAnimationFrame(scrolling);
    scrolling = undefined;
    destroyPuppet().finally(registerStart);

    if (targetIndex != null && targetIndex != startIndex) {
      node.dispatchEvent(
        new CustomEvent("swap", {
          detail: { from: startIndex, to: targetIndex },
        })
      );
    }

    lastPosition = startIndex = targetIndex = null;
  }

  function startScroll(direction: boolean) {
    if (scrolling) return;
    const modifier = direction ? 1 : -1;
    const barrier = direction ? bounds.bottom : bounds.top;

    let then = Date.now();
    const scroll = () => {
      const y = lastPosition?.[1] || 0;
      const rate = Math.pow(
        1 - (-modifier * (y - barrier)) / scrollThreshold,
        2
      );

      const elapsed = Date.now() - then;
      then = Date.now();

      const parent = node.parentElement;
      if (!parent) return;
      parent.scrollBy(0, (elapsed * modifier * rate) / 2);
      handleMove();

      const top = parent.scrollTop;
      if (!direction && top <= 0) return;
      if (direction && top >= parent.scrollHeight) return;
      if (!scrolling) return;

      scrolling = requestAnimationFrame(scroll);
    };
    scrolling = requestAnimationFrame(scroll);
  }

  function handleDrag(event: Event) {
    event.preventDefault();
  }

  function handleChildren(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType != node.ELEMENT_NODE) return;
        const element = node as HTMLElement;
        const index = getIndex(element);
        if (index != null && index === startIndex) {
          element.style.opacity = "0";
        }
      });
    }
  }

  node.addEventListener("dragstart", handleDrag);
  const observer = new MutationObserver(handleChildren);
  registerStart();
  observer.observe(node, {
    childList: true,
  });
  return {
    destroy() {
      node.removeEventListener("touchstart", handleStart);
      node.removeEventListener("dragstart", handleDrag);
      observer.disconnect();
    },
  };
}

interface DraggableOptions {
  scrollThreshold?: number;
  fixedOffset?: number;
  margin?: number;
}
