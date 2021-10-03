const isStandalone =
  matchMedia("(display-mode: standalone)").matches ||
  navigator.standalone === true;

export { isStandalone };
