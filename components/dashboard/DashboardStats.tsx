"use client";

import { Clapperboard, Database, HardDrive, Images } from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";
import { useWallet } from "@/context/WalletContext";
import { demoAssets } from "@/components/demo/demoData";
import { getMediaType } from "@/lib/media/types";

interface Countable {
  name: string;
  blobName?: string;
  size: number;
  status?: string;
}

function summarize(assets: Countable[]) {
  let videos = 0;
  let images = 0;
  let bytes = 0;

  for (const asset of assets) {
    bytes += asset.size;

    const kind = getMediaType(asset.blobName || asset.name)?.kind;

    if (kind === "video") videos += 1;
    else if (kind === "image") images += 1;
  }

  return { files: assets.length, videos, images, bytes };
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 MB";

  const mb = bytes / 1024 / 1024;

  if (mb < 1) return `${(bytes / 1024).toFixed(2)} KB`;

  if (mb < 1024) return `${mb.toFixed(2)} MB`;

  return `${(mb / 1024).toFixed(2)} GB`;
}

export default function DashboardStats() {
  const { assets } = useStorageContext();
  const { walletConnected } = useWallet();

  const real = summarize(assets as Countable[]);
  const demo = summarize(demoAssets as Countable[]);

  const shown = walletConnected ? real : demo;

  const stats = [
    { title: "Files", value: shown.files, icon: Database },
    { title: "Videos", value: shown.videos, icon: Clapperboard },
    { title: "Images", value: shown.images, icon: Images },
    { title: "Storage used", value: formatBytes(shown.bytes), icon: HardDrive },
  ];

  return (
    <div className="grid grid-cols-2 border-y border-slate-800 md:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={`px-3 py-4 sm:px-4 sm:py-5 ${
              index > 0 ? "border-l border-slate-800" : ""
            }`}
          >
            <div className="flex items-center gap-2 text-slate-500">
              <Icon size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">
                {stat.title}
              </span>
            </div>

            <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>

            {!walletConnected && (
              <p className="mt-1 text-[11px] text-slate-600">Demo data</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
