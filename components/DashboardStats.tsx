"use client";

import {
  Images,
  FolderKanban,
  HardDrive,
  Wallet,
} from "lucide-react";

import { useWalletData } from "@/hooks/useWalletData";
import { useStorageContext } from "@/context/StorageContext";

export default function DashboardStats() {
  const {
    connected,
    loading,
    nfts,
  } = useWalletData();

  const {
    storageUsed,
  } = useStorageContext();

  /*
   * Count unique collections from
   * actual NFTs returned for the
   * connected wallet.
   */
  const collections =
    connected
      ? new Set(
          nfts
            .map((nft: any) =>
              nft.current_token_data
                ?.collection_name ??
              nft.current_collection
                ?.collection_name ??
              nft.collection?.name ??
              nft.collection ??
              null
            )
            .filter(Boolean)
        ).size
      : 0;

  const stats = [
    {
      title: "Wallet",
      value: connected
        ? "Connected"
        : "Not Connected",
      icon: Wallet,
    },
    {
      title: "NFTs",
      value:
        connected && loading
          ? "..."
          : connected
            ? nfts.length.toString()
            : "0",
      icon: Images,
    },
    {
      title: "Collections",
      value:
        connected && loading
          ? "..."
          : collections.toString(),
      icon: FolderKanban,
    },
    {
      title: "Storage Used",
      value:
        connected
          ? formatBytes(storageUsed)
          : "0 B",
      icon: HardDrive,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {item.title}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Icon
                  className="text-blue-400"
                  size={20}
                />
              </div>
            </div>

            <h2 className="mt-5 text-3xl font-bold text-white">
              {item.value}
            </h2>
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
