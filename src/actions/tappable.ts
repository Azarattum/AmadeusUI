export default function tappable(node: HTMLElement): { destroy: () => void } {
  function handleStart() {
    const timeout = setTimeout(() => {
      handleMouseOver();
    }, 100);

    const cancel = () => {
      clearTimeout(timeout);
      handleMouseLeave();
      node.removeEventListener("touchcancel", cancel);
      node.removeEventListener("touchmove", cancel);
      node.removeEventListener("touchend", once);
    };

    const once = () => {
      handleMouseOver();
      setTimeout(cancel, 100);
    };

    node.addEventListener("touchcancel", cancel, { passive: true, once: true });
    node.addEventListener("touchmove", cancel, { passive: true, once: true });
    node.addEventListener("touchend", once, { passive: true, once: true });
  }

  function handleMouseOver() {
    node.classList.add("tapped");
  }

  function handleMouseLeave() {
    node.classList.remove("tapped");
  }

  node.addEventListener("touchstart", handleStart);
  if (matchMedia("(pointer:fine)").matches) {
    node.addEventListener("mouseover", handleMouseOver);
    node.addEventListener("mouseleave", handleMouseLeave);
  }
  return {
    destroy() {
      node.removeEventListener("touchstart", handleStart);
      node.removeEventListener("mouseover", handleMouseOver);
      node.removeEventListener("mouseleave", handleMouseLeave);
    },
  };
}
