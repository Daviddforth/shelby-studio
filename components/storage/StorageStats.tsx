"use client";

import {
  HardDrive,
  Database,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";

export default function StorageStats() {
  const {
    assets,
    storageUsed,
  } = useStorageContext();

  const stored = assets.filter(
    (asset) => asset.status === "Stored"
  ).length;

  const pending = assets.filter(
    (asset) => asset.status === "Uploading"
  ).length;

  const stats = [
    {
      title: "Files",
      value: assets.length.toString(),
      icon: HardDrive,
    },
    {
      title: "Storage Used",
      value: formatStorage(storageUsed),
      icon: Database,
    },
    {
      title: "Stored",
      value: stored.toString(),
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      value: pending.toString(),
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-2 border-y border-slate-800 md:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={`px-4 py-4 ${
              index > 0 ? "border-l border-slate-800" : ""
            }`}
          >
            <div className="flex items-center gap-2 text-slate-500">
              <Icon size={15} />
              <span className="text-[11px] font-medium uppercase tracking-wide">
                {stat.title}
              </span>
            </div>

            <p className="mt-1.5 text-lg font-semibold text-white">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function formatStorage(bytes: number) {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(
    value >= 10 || index === 0 ? 0 : 1
  )} ${units[index]}`;
}
