"use client";

import { Clock3 } from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";
import { useWallet } from "@/context/WalletContext";

export default function RecentActivity() {
  const { assets } = useStorageContext();
  const { walletConnected } = useWallet();

  if (!walletConnected) {
    return (
      <EmptyState
        title="No activity"
        description="Connect your wallet to start using Shelby Studio."
      />
    );
  }

  if (assets.length === 0) {
    return (
      <EmptyState
        title="No activity"
        description="Upload your first asset to begin your creator journey."
      />
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Recent Activity
      </h2>

      <div className="mt-8 space-y-4">
        {assets.map((asset) => (
          <div
            key={asset.uid}
            className="rounded-2xl bg-slate-950 p-5"
          >
            <p className="font-semibold text-white">
              Uploaded {asset.name}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              {new Date(
                asset.uploadedAt
              ).toLocaleString()}
            </p>
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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
      <Clock3
        size={48}
        className="mx-auto text-slate-600"
      />

      <h2 className="mt-6 text-2xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-3 text-slate-400">
        {description}
      </p>
    </div>
  );
}