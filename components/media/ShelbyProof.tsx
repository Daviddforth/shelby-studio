import Link from "next/link";

import { ShieldCheck } from "lucide-react";

import ReportButton from "@/components/report/ReportButton";

import { mediaPagePath } from "@/lib/media/types";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** Facts a visitor can check on Shelby itself, so the page proves where the file lives. */
export default function ShelbyProof({
  owner,
  blobName,
  size,
  etag,
  committedAtMicros,
}: {
  owner: string;
  blobName: string;
  size: number;
  etag: string;
  committedAtMicros: number;
}) {
  const stored = committedAtMicros
    ? new Date(committedAtMicros / 1000).toISOString().replace("T", " ").slice(0, 16) + " UTC"
    : "";

  const rows: Array<[string, string]> = [
    ["Owner wallet", owner],
    ["File name", blobName],
    ["Size", formatBytes(size)],
    ...(stored ? ([["Stored on Shelby at", stored]] as Array<[string, string]>) : []),
    ...(etag ? ([["Content ID (etag)", etag]] as Array<[string, string]>) : []),
  ];

  return (
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <ShieldCheck size={16} className="text-emerald-400" />
        Stored on Shelby
      </div>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        This file is held in Shelby decentralized storage under the wallet below, not on Shelby
        Studio&apos;s own servers. You can check it yourself on Shelby.
      </p>

      <dl className="mt-4 space-y-2 text-xs">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 sm:grid-cols-[10rem_1fr]">
            <dt className="text-slate-500">{label}</dt>

            <dd className="break-all font-mono text-slate-300">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <a
          href={`https://explorer.shelby.xyz/shelbynet/account/${encodeURIComponent(owner)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-slate-800"
        >
          Verify on Shelby Explorer ↗
        </a>

        <ReportButton kind="media" target={mediaPagePath(owner, blobName)} label="Report this file" />
      </div>
    </section>
  );
}

export function ShelbyBadgeLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener"
      className="absolute left-2 top-2 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur transition hover:text-white"
    >
      Hosted on Shelby
    </Link>
  );
}
