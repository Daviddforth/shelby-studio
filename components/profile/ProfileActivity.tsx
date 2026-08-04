"use client";

import { Clock3 } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useStorageContext } from "@/context/StorageContext";

export default function ProfileActivity() {
  const { walletConnected } = useWallet();
  const { assets } = useStorageContext();

  if (!walletConnected) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="text-2xl font-bold text-white">
          Recent Activity
        </h2>

        <div className="mt-8 flex flex-col items-center text-center">
          <Clock3
            size={48}
            className="text-slate-600"
          />

          <p className="mt-4 text-lg font-semibold text-white">
            No activity yet
          </p>

          <p className="mt-2 text-slate-400">
            Connect your wallet to begin using Shelby Studio.
          </p>
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="text-2xl font-bold text-white">
          Recent Activity
        </h2>

        <div className="mt-8 flex flex-col items-center text-center">
          <Clock3
            size={48}
            className="text-slate-600"
          />

          <p className="mt-4 text-lg font-semibold text-white">
            No activity yet
          </p>

          <p className="mt-2 text-slate-400">
            Upload your first asset to see activity here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Recent Activity
      </h2>

      <div className="mt-6 space-y-4">
        {assets.map((asset) => (
          <div
            key={asset.uid}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <p className="font-medium text-white">
              Uploaded {asset.name}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {new Date(asset.uploadedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}