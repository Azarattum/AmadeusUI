/**
 * Generate selection haptic feedback
 */
export function select(): void {
  if (window.UINative) {
    window.UINative.feedback("selection");
  }
}

/**
 * Generate a light haptic feedback
 */
export function light(): void {
  if (window.UINative) {
    window.UINative.feedback("light");
  }
}

/**
 * Generate a rigid haptic feedback
 */
export function rigid(): void {
  if (window.UINative) {
    window.UINative.feedback("rigid");
  }
}
