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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Recent Activity
        </h2>

        <p className="mt-2 text-slate-400">
          Latest activity from your current workspace.
        </p>
      </div>

      {/* Activity Feed */}
      <div className="mt-8 space-y-3">
        {recentActivity.map((asset) => (
          <div
            key={asset.uid}
            className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Upload size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="truncate font-semibold text-white">
                  Asset uploaded
                </p>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 size={14} />
                  Stored
                </div>
              </div>

              <p className="mt-1 truncate text-sm text-slate-400">
                {asset.name}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Clock3 size={13} />

                <span>
                  {formatActivityTime(asset.uploadedAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
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
    <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
          <Clock3
            size={25}
            className="text-slate-500"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>
    </div>
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