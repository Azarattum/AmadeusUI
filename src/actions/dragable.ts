import { animateTo } from "utils/animation";
import { rigid, select } from "utils/haptics";

function findCommonAncestor(
  elements: Element[],
  source: HTMLElement
): {
  commonAncestor?: HTMLElement;
  target: HTMLElement;
  sourceIndex?: number;
  targetIndex?: number;
} {
  let parent = source.parentElement;
  if (!parent) return { target: null };

  let sourceIndex = Array.prototype.indexOf.call(parent.children, source);
  let depth = 0;

  while (parent) {
    let targetIndex = -1;
    const element =
      (elements.find((x) => {
        if (x == source) return false;

        let parentX = x.parentElement;
        for (let i = 0; i < depth; i++) {
          if (i == depth - 1) {
            targetIndex = Array.prototype.indexOf.call(
              parentX?.parentElement?.children || [],
              parentX
            );
          }
          parentX = parentX?.parentElement;
        }

        return parentX == parent;
      }) as HTMLElement) || null;

    if (element) {
      return {
        commonAncestor: parent,
        target: element,
        sourceIndex,
        targetIndex,
      };
    }

    depth += 1;
    sourceIndex = Array.prototype.indexOf.call(
      parent.parentElement?.children || [],
      parent
    );
    parent = parent?.parentElement;
  }

  if (!parent) return { target: null };
}

export default function draggable(node: HTMLElement): { destroy: () => void } {
  let startPosition = [0, 0];
  let target: HTMLElement | null = null;
  let to: number | null = null;
  let from: number | null = null;
  const transformed = new Set<HTMLElement>();

  function handleStart(event: TouchEvent) {
    const start = () => {
      rigid();
      node.dispatchEvent(new Event("scrollcancel", { bubbles: true }));

      startPosition = [event.touches[0].clientX, event.touches[0].clientY];
      addEventListener("touchmove", handleMove);
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
    const { clientX, clientY } = event.touches[0];
    const dx = clientX - startPosition[0];
    const dy = clientY - startPosition[1];
    node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

    const elements = document.elementsFromPoint(clientX, clientY);
    const {
      target: element = null,
      sourceIndex,
      targetIndex,
    } = findCommonAncestor(elements, node);

    if (element == target) return;
    target = element as HTMLElement;

    if (target) {
      const modifier = sourceIndex > targetIndex ? 1 : -1;
      const seen = transformed.has(target);

      const transform = !seen
        ? `translate3d(0,${modifier * (node.clientHeight + 1)}px,0)`
        : "translate3d(0,0,0)";
      if (!seen) transformed.add(target);
      else transformed.delete(target);

      select();
      animateTo(target, [{ transform }], {
        duration: 300,
        easing: "ease",
      });

      from = sourceIndex;
      //A little bit hacky :(
      to = targetIndex + (from == sourceIndex ? -seen : 0);
    }
  }

  function handleEnd() {
    node.style.transform = `none`;
    node.classList.remove("dragging");
    removeEventListener("touchmove", handleMove);
    removeEventListener("touchend", handleEnd);

    transformed.forEach((x) => {
      x.style.transform = "none";
    });
    transformed.clear();

    if (to == null || from == null) return;
    node.dispatchEvent(new CustomEvent("swap", { detail: { from, to } }));
  }

  node.addEventListener("touchstart", handleStart);
  return {
    destroy() {
      node.removeEventListener("touchstart", handleStart);
    },
  };
}
