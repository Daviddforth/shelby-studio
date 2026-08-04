"use client";

import {
  Images,
  Database,
  FolderKanban,
  HardDrive,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { useStorageContext } from "@/context/StorageContext";

export default function ProfileStats() {
  const { walletConnected } = useWallet();
  const { assets } = useStorageContext();

  const totalFiles = walletConnected ? assets.length : 0;

  const totalStorage = walletConnected
    ? assets.reduce((sum, asset) => sum + asset.size, 0)
    : 0;

  const storageText =
    totalStorage > 1024 * 1024
      ? `${(totalStorage / (1024 * 1024)).toFixed(2)} MB`
      : `${(totalStorage / 1024).toFixed(2)} KB`;

  const stats = [
    {
      title: "NFTs",
      value: walletConnected ? "0" : "0",
      icon: Images,
    },
    {
      title: "Collections",
      value: walletConnected ? "0" : "0",
      icon: FolderKanban,
    },
    {
      title: "Files",
      value: totalFiles.toString(),
      icon: Database,
    },
    {
      title: "Storage Used",
      value: walletConnected ? storageText : "0 MB",
      icon: HardDrive,
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

            <p className="mt-5 text-slate-400">
              {stat.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}