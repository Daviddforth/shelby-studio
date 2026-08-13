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

  const collectionCount = hasCollection ? 1 : 0;
  const metadataCount = hasMetadata ? 1 : 0;

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 MB";

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
    },
    {
      title: "Collections",
      value: collectionCount,
      icon: FolderKanban,
    },
    {
      title: "Metadata",
      value: metadataCount,
      icon: FileJson,
    },
    {
      title: "Storage Used",
      value: formatBytes(totalStorage),
      icon: HardDrive,
    },
  ];

  return (
    <div className="grid grid-cols-2 border-y border-slate-800 md:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={`px-4 py-5 ${
              index > 0 ? "border-l border-slate-800" : ""
            }`}
          >
            <div className="flex items-center gap-2 text-slate-500">
              <Icon size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">
                {stat.title}
              </span>
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {walletConnected ? stat.value : 0}
            </p>
          </div>
        );
      })}
    </div>
  );
}
