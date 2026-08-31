"use client";

import {
  HardDrive,
  Loader2,
} from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";
import { useWallet } from "@/context/WalletContext";
import { demoAssets } from "@/components/demo/demoData";

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) / Math.log(1024)
    ),
    units.length - 1
  );

  return `${(
    bytes / Math.pow(1024, index)
  ).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

export default function StorageOverview() {
  const {
    walletConnected,
    network,
  } = useWallet();

  const {
    assets,
    storageUsed,
    loading,
    error,
  } = useStorageContext();

  const totalFiles = assets.length;

  const demoStorageUsed = demoAssets.reduce(
    (sum, asset) => sum + asset.size,
    0
  );

  const demoTotalFiles = demoAssets.length;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HardDrive
              size={17}
              strokeWidth={1.8}
              className="text-blue-400"
            />

            <h2 className="text-base font-semibold text-white">
              Storage
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Shelby Storage usage
          </p>
        </div>

        {loading ? (
          <Loader2
            size={16}
            className="animate-spin text-slate-500"
          />
        ) : (
          <span className="text-sm font-medium text-slate-300">
            {walletConnected
              ? formatBytes(storageUsed)
              : formatBytes(demoStorageUsed)}
          </span>
        )}
      </div>

      <div className="mt-5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-2 w-full rounded-full bg-blue-500/70" />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-4 text-xs">
        <div>
          <span className="text-slate-500">
            Files
          </span>

          <p className="mt-1 font-medium text-white">
            {walletConnected ? totalFiles : demoTotalFiles}
          </p>
        </div>

        <div>
          <span className="text-slate-500">
            Storage Used
          </span>

          <p className="mt-1 font-medium text-white">
            {walletConnected
              ? formatBytes(storageUsed)
              : formatBytes(demoStorageUsed)}
          </p>
        </div>

        <div>
          <span className="text-slate-500">
            Network
          </span>

          <p className="mt-1 font-medium text-white">
            {network}
          </p>
        </div>

        <div>
          <span className="text-slate-500">
            Status
          </span>

          <p
            className={
              error
                ? "mt-1 font-medium text-red-400"
                : walletConnected
                  ? "mt-1 font-medium text-emerald-400"
                  : "mt-1 font-medium text-slate-500"
            }
          >
            {error
              ? "Unavailable"
              : walletConnected
                ? "Connected"
                : "Demo"}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-xs text-red-400">
          {error}
        </p>
      )}
    </section>
  );
}
