"use client";

import { Images, FolderKanban, HardDrive, Wallet } from "lucide-react";
import { useWalletData } from "@/hooks/useWalletData";

export default function DashboardStats() {
  const { connected, loading, nfts } = useWalletData();

  const stats = [
    {
      title: "Wallet",
      value: connected ? "Connected" : "Disconnected",
      icon: Wallet,
    },
    {
      title: "NFTs",
      value: loading ? "..." : nfts.length.toString(),
      icon: Images,
    },
    {
      title: "Collections",
      value: loading
        ? "..."
        : new Set(
            nfts.map(
              (nft: any) =>
                nft.current_token_data?.collection_name ??
                nft.collection?.name ??
                "Unknown"
            )
          ).size.toString(),
      icon: FolderKanban,
    },
    {
      title: "Shelby Storage",
      value: connected ? "--" : "0 MB",
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
              <p className="text-slate-400">{item.title}</p>

              <Icon className="text-blue-500" size={22} />
            </div>

            <h2 className="mt-5 text-4xl font-bold text-white">
              {item.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
}