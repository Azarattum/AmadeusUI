import scrollIntoView from "scroll-into-view";

export function scroller(
  node: HTMLElement,
  { hider, header, dynamicHider = false }: ScrollerOptions
): { destroy: () => void } {
  let touched = false;
  const hiderElement = hider
    ? (node.querySelector(hider) as HTMLButtonElement)
    : null;
  const headerElement = header
    ? node.parentElement?.querySelector(header) || null
    : null;

  const overflow = node.style.overflowY;

  function handleStart(event: TouchEvent) {
    if (node.scrollHeight <= node.clientHeight) return;
    event.stopPropagation();

    touched = true;
    node.style.overflowY = overflow;
    node.addEventListener("touchend", handleEnd);

    // A weird hack to fix iOS scroll blocking from body in PWA mode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((navigator as any).standalone && !node.scrollTop) node.scrollTo(0, 1);
  }

  function handleEnd() {
    touched = false;
    node.style.overflowY = overflow;
    node.removeEventListener("touchend", handleEnd);
  }

  function handleScroll({ target }: Event) {
    const top = (target as HTMLElement).scrollTop;
    if (hiderElement && touched && top < -80) hiderElement?.click();
  }

  function handleCancel() {
    node.style.overflowY = "hidden";
  }

  function handleUpdate() {
    if (!hiderElement) return;
    const shown =
      node.scrollHeight - hiderElement.clientHeight > node.clientHeight;
    hiderElement.style.display = shown ? "block" : "none";
  }

  function scrollToTop() {
    scrollIntoView(node.firstElementChild as HTMLElement, {
      time: 200,
      align: { top: 0, topOffset: 64 },
    });
  }

  node.addEventListener("touchstart", handleStart, { passive: true });
  node.addEventListener("scroll", handleScroll, { passive: true });
  node.addEventListener("scrollcancel", handleCancel);
  headerElement?.addEventListener("click", scrollToTop);

  let mutationObserver: MutationObserver | null = null;
  let intersectionObserver: IntersectionObserver | null = null;
  if (dynamicHider) {
    mutationObserver = new MutationObserver(() => setTimeout(handleUpdate, 0));
    mutationObserver.observe(node, {
      childList: true,
    });

    const parent = node.parentElement;
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleUpdate();
      },
      { root: parent?.parentElement }
    );
    if (parent) intersectionObserver.observe(parent);
  }

  return {
    destroy() {
      mutationObserver?.disconnect();
      intersectionObserver?.disconnect();
      node.removeEventListener("touchstart", handleStart);
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
