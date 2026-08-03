"use client";

import { HardDrive, Images, FolderKanban, Box } from "lucide-react";
import { useWalletData } from "@/hooks/useWalletData";

export default function DashboardStats() {
  const { loading, nfts } = useWalletData();

  const stats = [
    {
      title: "Shelby NFTs",
      value: loading ? "..." : nfts.length,
      icon: Images,
    },
    {
      title: "Aptos NFTs",
      value: loading ? "..." : nfts.length,
      icon: Box,
    },
    {
      title: "Collections",
      value: loading ? "..." : 0,
      icon: FolderKanban,
    },
    {
      title: "Storage Used",
      value: loading ? "..." : "0 MB",
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

              <Icon
                size={22}
                className="text-blue-400"
              />
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