"use client";

import {
  HardDrive,
  Database,
  CheckCircle2,
  Clock,
} from "lucide-react";

const stats = [
  {
    title: "Files",
    value: "0",
    icon: HardDrive,
  },
  {
    title: "Storage Used",
    value: "0 MB",
    icon: Database,
  },
  {
    title: "Stored",
    value: "0",
    icon: CheckCircle2,
  },
  {
    title: "Pending",
    value: "0",
    icon: Clock,
  },
];

export default function StorageStats() {
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