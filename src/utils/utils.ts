/**
 * Promise based delay function. Wrapper over setTimeout
 * @param ms Time in milliseconds
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Shuffles the array in place and returns it
 * @param array Array to shuffle
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Creates a shallow copy of the array with all the objects inside cloned
 * @param array Array to clone
 */
export function cloneArray<T>(array: T[]): T[] {
  const cloned = [];
  for (const obj of array) {
    cloned.push({ ...obj });
  }
  return cloned;
}
