export const WATCH_MAX_SECONDS_PER_REPORT = 60;

export interface WatchStat {
  seconds: number;
  plays: number;
}

export function formatWatch(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;

  const minutes = Math.round(seconds / 60);

  if (minutes < 120) return `${minutes} min`;

  return `${(minutes / 60).toFixed(1)} h`;
}
