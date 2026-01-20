export function parseDuration(totalSeconds) {
  totalSeconds = Math.floor(totalSeconds);

  const DAY = 86400;
  const HOUR = 3600;
  const MINUTE = 60;

  const days = Math.floor(totalSeconds / DAY);
  let remainder = totalSeconds % DAY;

  const hours = Math.floor(remainder / HOUR);
  remainder %= HOUR;

  const minutes = Math.floor(remainder / MINUTE);
  const seconds = remainder % MINUTE;

  const parts = [];

  if (days) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  if (seconds) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

  return parts.length ? parts.join(", ") : "0 seconds";
}
