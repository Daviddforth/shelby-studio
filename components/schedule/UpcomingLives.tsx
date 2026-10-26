import Link from "next/link";

import { CalendarClock } from "lucide-react";

import Countdown from "@/components/schedule/Countdown";

import type { ScheduledLive } from "@/lib/schedule/types";

/** Upcoming streams. Pass `names` to show whose stream each one is. */
export default function UpcomingLives({
  lives,
  names,
  heading = "Upcoming lives",
}: {
  lives: ScheduledLive[];
  names?: Record<string, string>;
  heading?: string;
}) {
  if (lives.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-indigo-300">
        <CalendarClock size={14} />
        {heading}
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lives.map((live) => (
          <Link
            key={`${live.owner}-${live.id}`}
            href={`/c/${live.owner}`}
            className="rounded-2xl border border-indigo-500/25 bg-indigo-500/5 p-4 transition hover:border-indigo-400/60"
          >
            <p className="text-xs font-semibold text-indigo-300">
              <Countdown startsAt={live.startsAt} />
            </p>

            <p className="mt-2 line-clamp-2 break-words text-sm font-semibold text-white">{live.title}</p>

            {names && <p className="mt-1 truncate text-xs text-slate-400">{names[live.owner] ?? live.owner}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
