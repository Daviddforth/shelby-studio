"use client";

import {
  Clock3,
  Upload,
  CheckCircle2,
} from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";
import { useWallet } from "@/context/WalletContext";

export default function RecentActivity() {
  const { assets } = useStorageContext();
  const { walletConnected } = useWallet();

  if (!walletConnected) {
    return (
      <EmptyState
        title="No activity yet"
        description="Connect your wallet to start using your Shelby Studio workspace."
      />
    );
  }

  if (assets.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Your latest workspace activity will appear here after you upload your first asset."
      />
    );
  }

  const recentActivity = [...assets]
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() -
        new Date(a.uploadedAt).getTime()
    )
    .slice(0, 5);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div>
        <h2 className="text-base font-semibold text-white">
          Recent Activity
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Latest workspace activity
        </p>
      </div>

      <div className="mt-5 divide-y divide-slate-800">
        {recentActivity.map((asset) => (
          <div
            key={asset.uid}
            className="flex items-center gap-3 py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Upload size={15} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                Asset uploaded
              </p>

              <p className="truncate text-xs text-slate-500">
                {asset.name}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 size={13} />
              <span>Stored</span>
            </div>

            <span className="hidden text-xs text-slate-600 sm:block">
              {formatActivityTime(asset.uploadedAt)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
      <div className="max-w-sm">
        <Clock3
          size={22}
          className="mx-auto text-slate-600"
        />

        <h2 className="mt-4 text-base font-semibold text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </section>
  );
}

function formatActivityTime(date: string) {
  const timestamp = new Date(date);

  if (Number.isNaN(timestamp.getTime())) {
    return "Recently";
  }

  return timestamp.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
