"use client";

import { HardDrive } from "lucide-react";
import { useStorageContext } from "@/context/StorageContext";

export default function StorageOverview() {
  const { assets } = useStorageContext();

  const totalBytes = assets.reduce(
    (sum, asset) => sum + asset.size,
    0
  );

  const usedMB = totalBytes / 1024 / 1024;
  const totalLimitMB = 500;

  const percentage = Math.min(
    (usedMB / totalLimitMB) * 100,
    100
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HardDrive size={17} className="text-blue-400" />
            <h2 className="text-base font-semibold text-white">
              Storage
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Shelby Storage usage
          </p>
        </div>

        <span className="text-sm font-medium text-slate-300">
          {usedMB.toFixed(2)} MB
          <span className="text-slate-600"> / {totalLimitMB} MB</span>
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-5 flex items-center gap-6 text-xs">
        <div>
          <span className="text-slate-500">Files</span>
          <p className="mt-1 font-medium text-white">
            {assets.length}
          </p>
        </div>

        <div>
          <span className="text-slate-500">Network</span>
          <p className="mt-1 font-medium text-white">
            Shelbynet
          </p>
        </div>

        <div>
          <span className="text-slate-500">Status</span>
          <p className="mt-1 font-medium text-emerald-400">
            Healthy
          </p>
        </div>
      </div>
    </section>
  );
}
