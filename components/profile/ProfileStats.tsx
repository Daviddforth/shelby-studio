"use client";

import {
  Database,
  HardDrive,
  FolderKanban,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { useStorageContext } from "@/context/StorageContext";
import { useProject } from "@/context/project/ProjectContext";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}

export default function ProfileStats() {
  const { walletConnected } = useWallet();
  const { assets } = useStorageContext();
  const { projects } = useProject();

  const totalFiles =
    walletConnected ? assets.length : 0;

  const totalStorage =
    walletConnected
      ? assets.reduce(
          (sum, asset) => sum + asset.size,
          0
        )
      : 0;

  const stats = [
    {
      title: "Projects",
      value: walletConnected
        ? projects.length
        : 0,
      icon: FolderKanban,
    },
    {
      title: "Files",
      value: totalFiles,
      icon: Database,
    },
    {
      title: "Storage Used",
      value: formatBytes(totalStorage),
      icon: HardDrive,
    },
  ];

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="bg-slate-950 px-5 py-5"
          >
            <div className="flex items-center gap-2 text-slate-500">
              <Icon
                size={15}
                className="text-blue-400"
              />

              <span className="text-[11px] font-medium uppercase tracking-wider">
                {stat.title}
              </span>
            </div>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
