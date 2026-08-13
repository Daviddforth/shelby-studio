"use client";

import {
  Clock3,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { useStorageContext } from "@/context/StorageContext";

export default function ProfileActivity() {
  const { walletConnected } = useWallet();
  const { assets } = useStorageContext();

  if (!walletConnected || assets.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
            <Clock3
              size={17}
              className="text-slate-500"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              Recent Activity
            </h2>

            <p className="text-xs text-slate-500">
              Your latest Shelby Studio activity.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-slate-800 px-5 py-8 text-center">
          <p className="text-sm font-medium text-slate-300">
            No activity yet
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Upload an asset to start building your activity history.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
          <Clock3
            size={17}
            className="text-blue-400"
          />
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">
            Recent Activity
          </h2>

          <p className="text-xs text-slate-500">
            Your latest Shelby Studio activity.
          </p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-slate-800">
        {assets.slice(0, 5).map((asset) => (
          <div
            key={asset.uid}
            className="flex items-center gap-3 py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950">
              {asset.status === "Stored" ? (
                <CheckCircle2
                  size={15}
                  className="text-emerald-400"
                />
              ) : (
                <UploadCloud
                  size={15}
                  className="text-blue-400"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-200">
                Uploaded {asset.name}
              </p>

              <p className="mt-0.5 text-xs text-slate-600">
                {new Date(
                  asset.uploadedAt
                ).toLocaleString()}
              </p>
            </div>

            <span
              className={`text-[10px] font-medium ${
                asset.status === "Stored"
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {asset.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
