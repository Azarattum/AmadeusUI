export function formatTime(x: number): string {
  const minutes = ~~(x / 60);
  const seconds = (x - minutes * 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  if (!Number.isFinite(x)) return seconds;
  return `${minutes}:${seconds}`;
}
