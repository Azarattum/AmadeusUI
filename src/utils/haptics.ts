const scope = globalThis as ExtendedGlobal;

/**
 * Generate selection haptic feedback
 */
export function select(): void {
  if (scope.UINative) {
    scope.UINative.feedback("selection");
  }
}

/**
 * Generate a light haptic feedback
 */
export function light(): void {
  if (scope.UINative) {
    scope.UINative.feedback("light");
  }
}

type ExtendedGlobal = typeof globalThis & {
  UINative?: { feedback: (string) => void };
};
