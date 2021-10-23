const global = globalThis as ExtendedGlobal;

/**
 * Generate selection haptic feedback
 */
export function select(): void {
  if (global.UINative) {
    global.UINative.feedback("selection");
  }
}

/**
 * Generate a light haptic feedback
 */
export function light(): void {
  if (global.UINative) {
    global.UINative.feedback("light");
  }
}

type ExtendedGlobal = typeof globalThis & {
  UINative?: { feedback: (string) => void };
};
