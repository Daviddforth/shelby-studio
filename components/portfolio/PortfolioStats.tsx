"use client";

import {
  Images,
  FolderKanban,
  Database,
  HardDrive,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useCollection } from "@/context/CollectionContext";
import { useStorageContext } from "@/context/StorageContext";

export default function PortfolioStats() {
  const {
    walletConnected,
  } = useWallet();

  const {
    nfts,
  } = usePortfolio();

  const {
    collection,
  } = useCollection();

  const {
    assets,
    storageUsed,
  } = useStorageContext();

  /*
   * No wallet means absolutely no
   * portfolio statistics.
   */
  const nftCount =
    walletConnected
      ? nfts.length
      : 0;

  const collectionCount =
    walletConnected &&
    collection.name.trim().length > 0
      ? 1
      : 0;

  const assetCount =
    walletConnected
      ? assets.length
      : 0;

  const storage =
    walletConnected
      ? storageUsed
      : 0;

  const stats = [
    {
      title: "NFTs",
      value: nftCount.toString(),
      icon: Images,
    },
    {
      title: "Collections",
      value:
        collectionCount.toString(),
      icon: FolderKanban,
    },
    {
      title: "Assets",
      value: assetCount.toString(),
      icon: Database,
    },
    {
      title: "Storage Used",
      value: formatBytes(storage),
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
                size={30}
                className="text-blue-400"
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

function formatBytes(bytes: number) {
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
      Math.log(bytes) /
        Math.log(1024)
    ),
    units.length - 1
  );

  const value =
    bytes /
    Math.pow(1024, index);

  return `${value.toFixed(
    value >= 10 || index === 0
      ? 0
      : 1
  )} ${units[index]}`;
}
