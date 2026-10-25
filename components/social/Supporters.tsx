import Link from "next/link";

import { Coins } from "lucide-react";

import { formatApt, type TipSummary } from "@/lib/social/types";

/** Public list of the latest tips. Amounts and senders come from the network, not from the sender's say-so. */
export default function Supporters({
  summary,
  names,
}: {
  summary: TipSummary;
  names: Record<string, string>;
}) {
  if (summary.count === 0) return null;

  return (
    <section className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
          <Coins size={15} className="text-amber-400" />
          Supporters
        </h2>

        <p className="text-xs text-slate-400">
          {summary.count} {summary.count === 1 ? "tip" : "tips"} · {formatApt(summary.total)} APT
        </p>
      </div>

      <ul className="mt-3 space-y-1.5 text-sm">
        {summary.recent.map((tip) => (
          <li key={tip.hash} className="flex items-center justify-between gap-3 text-slate-300">
            <Link href={`/c/${tip.from}`} className="min-w-0 truncate hover:text-white hover:underline">
              {names[tip.from] ?? `${tip.from.slice(0, 8)}…${tip.from.slice(-4)}`}
            </Link>

            <span className="shrink-0 font-medium text-amber-300">{formatApt(tip.amount)} APT</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
