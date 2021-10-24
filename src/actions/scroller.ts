import scrollIntoView from "scroll-into-view";

export function scroller(
  node: HTMLElement,
  { hider, header, dynamicHider = false }: ScrollerOptions
): { destroy: () => void } {
  let touched = false;
  const hiderElement = node.querySelector(hider) as HTMLElement | undefined;
  const headerElement = node.parentElement?.querySelector(header) as
    | HTMLElement
    | undefined;

  const overflow = node.style.overflowY;

  function handleStart(event: TouchEvent) {
    if (node.scrollHeight > node.clientHeight) event.stopPropagation();
    touched = true;
    node.style.overflowY = overflow;
  }

  function handleEnd() {
    touched = false;
    node.style.overflowY = overflow;
  }

  function handleScroll({ target }) {
    if (hiderElement && touched && target.scrollTop < -80) hiderElement.click();
  }

  function handleCancel() {
    node.style.overflowY = "hidden";
  }

  function handleUpdate() {
    const shown =
      node.scrollHeight - hiderElement.clientHeight > node.clientHeight;
    hiderElement.style.display = shown ? "block" : "none";
  }

  function scrollToTop() {
    scrollIntoView(node.firstElementChild, {
      time: 200,
      align: { top: 0, topOffset: 64 },
    });
  }

  node.addEventListener("touchstart", handleStart, { passive: true });
  node.addEventListener("touchend", handleEnd);
  node.addEventListener("scroll", handleScroll, { passive: false });
  node.addEventListener("scrollcancel", handleCancel);
  headerElement?.addEventListener("click", scrollToTop);

  let mutationObserver: MutationObserver | null = null;
  let intersectionObserver: IntersectionObserver | null = null;
  if (dynamicHider) {
    mutationObserver = new MutationObserver(() => setTimeout(handleUpdate, 0));
    mutationObserver.observe(node, {
      childList: true,
    });

    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleUpdate();
      },
      { root: node.parentElement.parentElement }
    );
    intersectionObserver.observe(node.parentElement);
  }

  return {
    destroy() {
      mutationObserver?.disconnect();
      intersectionObserver?.disconnect();
      node.removeEventListener("touchstart", handleStart);
      node.removeEventListener("touchend", handleEnd);
      node.removeEventListener("scroll", handleScroll);
      node.removeEventListener("scrollcancel", handleCancel);
      headerElement?.removeEventListener("click", scrollToTop);
    },
  };
}

export interface ScrollerOptions {
  hider?: string;
  header?: string;
  dynamicHider?: boolean;
}
