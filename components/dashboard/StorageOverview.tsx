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

  // Development limit (later this will come from Shelby)
  const totalLimitMB = 500;

  const percentage = Math.min(
    (usedMB / totalLimitMB) * 100,
    100
  );

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-blue-600 p-4">
          <HardDrive
            size={28}
            className="text-white"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Storage Overview
          </h2>

          <p className="text-slate-400">
            Shelby Storage Usage
          </p>
        </div>
      </div>

      <div className="mt-8">

        <div className="mb-3 flex justify-between">
          <span className="text-slate-400">
            Used
          </span>

          <span className="font-semibold text-white">
            {usedMB.toFixed(2)} MB / {totalLimitMB} MB
          </span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-6">

          <Stat
            title="Files"
            value={assets.length.toString()}
          />

          <Stat
            title="Network"
            value="Shelbynet"
          />

          <Stat
            title="Status"
            value="Healthy"
          />

        </div>

      </div>
    </div>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-950 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}