export default function expandable(node: HTMLElement): { destroy: () => void } {
  async function expand() {
    const offset = (navigator as any).standalone ? 31 : 0;
    const rect = node.getBoundingClientRect();
    const x = innerWidth / 2 - rect.width / 2 - rect.x;
    const y = innerHeight / 2 - rect.height / 2 - rect.y + offset;
    const w = innerWidth / rect.width;
    const h = (innerHeight - offset) / rect.height;

    const transform = `translate3d(${x}px, ${y}px, 0) scale(${w}, ${h})`;
    node.style.transform = transform;
    node.style.zIndex = "100";

    const untransform = `translateZ(0) scale(${1 / w}, ${1 / h})`;
    node.childNodes.forEach((x) => {
      if (x.nodeType != x.ELEMENT_NODE) return;
      (x as HTMLElement).style.transform = untransform;
    });

    document.body.classList.add("focused");
  }

  function retract() {
    //Restore children elements
    node.childNodes.forEach((x) => {
      if (x.nodeType != x.ELEMENT_NODE) return;
      (x as HTMLElement).style.transform = "none";
    });

    //Reverse transform
    node.style.transform = "none";

    //Wait for the animation and restore zIndex
    const duration = parseFloat(getComputedStyle(node).transitionDuration);
    setTimeout(() => {
      (node.style as any).zIndex = null;
    }, duration * 1000);

    document.body.classList.remove("focused");
  }

  node.addEventListener("expand", expand);
  node.addEventListener("retract", retract);
  return {
    destroy() {
      node.removeEventListener("expand", expand);
      node.removeEventListener("retract", retract);
    },
  };
}
