export function formatTime(x: number): string {
  x = Math.round(x);
  if (x <= 0) x = 0;
  const minutes = ~~(x / 60);
  const seconds = (x - minutes * 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  if (!Number.isFinite(x)) return seconds;
  return `${minutes}:${seconds}`;
}
