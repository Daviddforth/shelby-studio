"use client";

import { useEffect, useState } from "react";

function format(ms: number) {
  if (ms <= 0) return "Starting now";

  const minutes = Math.floor(ms / 60_000);

  const days = Math.floor(minutes / 1440);

  const hours = Math.floor((minutes % 1440) / 60);

  if (days > 0) return `in ${days}d ${hours}h`;

  if (hours > 0) return `in ${hours}h ${minutes % 60}m`;

  return `in ${Math.max(1, minutes)}m`;
}

/** "in 2h 5m", refreshed every 30 seconds. Shows the full local date and time on hover. */
export default function Countdown({ startsAt }: { startsAt: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // Waits until the browser is ready so the server and browser text match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());

    const timer = setInterval(() => setNow(Date.now()), 30_000);

    return () => clearInterval(timer);
  }, []);

  const time = new Date(startsAt).getTime();

  return (
    <time dateTime={startsAt} title={new Date(startsAt).toLocaleString()} suppressHydrationWarning>
      {now === null ? new Date(startsAt).toLocaleDateString() : format(time - now)}
    </time>
  );
}
