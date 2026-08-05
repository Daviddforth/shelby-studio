"use client";

import {
  Clock3,
  Wallet,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { useStorageContext } from "@/context/StorageContext";

export default function RecentActivity() {
  const {
    walletConnected,
  } = useWallet();

  const {
    assets,
  } = useStorageContext();

  if (!walletConnected) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
        <Wallet
          size={42}
          className="mx-auto text-slate-600"
        />

        <h2 className="mt-5 text-xl font-semibold text-white">
          No Activity Loaded
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Connect your wallet to access your
          Shelby Studio activity.
        </p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
        <Clock3
          size={42}
          className="mx-auto text-slate-600"
        />

        <h2 className="mt-5 text-xl font-semibold text-white">
          No Recent Activity
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Your recent workspace activity will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold text-white">
        Recent Activity
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Recent activity from your current
        Shelby Studio workspace.
      </p>

      <div className="mt-6 space-y-3">
        {assets
          .slice(0, 5)
          .map((asset) => (
            <div
              key={asset.uid}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4"
            >
              <div>
                <p className="font-medium text-white">
                  Uploaded {asset.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {new Date(
                    asset.uploadedAt
                  ).toLocaleString()}
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                {asset.status}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
