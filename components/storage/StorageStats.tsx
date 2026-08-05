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
    (asset) =>
      asset.status === "Uploading"
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
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center justify-between">
              <Icon
                className="text-blue-400"
                size={30}
              />

              <span className="text-3xl font-bold text-white">
                {stat.value}
              </span>
            </div>

            <p className="mt-4 text-slate-400">
              {stat.title}
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

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(
    value >= 10 || index === 0 ? 0 : 1
  )} ${units[index]}`;
}