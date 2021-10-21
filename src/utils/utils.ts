/**
 * Promise based delay function. Wrapper over setTimeout
 * @param ms Time in milliseconds
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns a copy of the array but shuffled
 * @param array Array to shuffle
 */
export function shuffle<T>(array: T[]): T[] {
  array = [...array];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
