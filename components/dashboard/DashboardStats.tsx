"use client";

import {
  Database,
  FolderKanban,
  FileJson,
  HardDrive,
} from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";
import { useWallet } from "@/context/WalletContext";
import { useCollection } from "@/context/CollectionContext";
import { useMetadata } from "@/context/MetadataContext";

export default function DashboardStats() {
  const { assets } = useStorageContext();
  const { walletConnected } = useWallet();
  const { hasCollection } = useCollection();
  const { hasMetadata } = useMetadata();

  const totalFiles = assets.length;

  const totalStorage = assets.reduce(
    (sum, asset) => sum + asset.size,
    0
  );

  const collectionCount =
    hasCollection ? 1 : 0;

  const metadataCount =
    hasMetadata ? 1 : 0;

  function formatBytes(bytes: number) {
    if (bytes === 0) {
      return "0 MB";
    }

    const mb = bytes / 1024 / 1024;

    if (mb < 1) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${mb.toFixed(2)} MB`;
  }

  const stats = [
    {
      title: "Assets",
      value: totalFiles,
      icon: Database,
      color: "text-blue-400",
    },
    {
      title: "Collections",
      value: collectionCount,
      icon: FolderKanban,
      color: "text-purple-400",
    },
    {
      title: "Metadata",
      value: metadataCount,
      icon: FileJson,
      color: "text-green-400",
    },
    {
      title: "Storage Used",
      value: formatBytes(totalStorage),
      icon: HardDrive,
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
          >
            <div className="flex items-center justify-between">
              <Icon
                size={30}
                className={stat.color}
              />

              <span className="text-3xl font-bold text-white">
                {walletConnected
                  ? stat.value
                  : 0}
              </span>
            </div>

            <p className="mt-6 text-slate-400">
              {stat.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
