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

/**
 * Generate a rigid haptic feedback
 */
export function rigid(): void {
  if (scope.UINative) {
    scope.UINative.feedback("rigid");
  }
}

type ExtendedGlobal = typeof globalThis & {
  UINative?: { feedback: (type: string) => void };
};
