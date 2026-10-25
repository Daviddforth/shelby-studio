"use client";

import { useEffect, useState } from "react";

import { Clapperboard, Coins, Database, Eye, HardDrive, Images, Users } from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";
import { useWallet } from "@/context/WalletContext";
import { formatApt } from "@/lib/social/types";
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
  const { walletConnected, walletAddress } = useWallet();

  const [audience, setAudience] = useState<{ views: number; followers: number; tipCount: number; tipTotal: string } | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    let cancelled = false;

    fetch(`/api/audience?owner=${encodeURIComponent(walletAddress)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled && data?.success) setAudience(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  const real = summarize(assets as Countable[]);
  const demo = summarize(demoAssets as Countable[]);

  const shown = walletConnected ? real : demo;

  const stats = [
    { title: "Files", value: shown.files, icon: Database },
    { title: "Videos", value: shown.videos, icon: Clapperboard },
    { title: "Images", value: shown.images, icon: Images },
    { title: "Storage used", value: formatBytes(shown.bytes), icon: HardDrive },
  ];

  const audienceStats = [
    { title: "Page & file views", value: audience?.views ?? 0, icon: Eye },
    { title: "Followers", value: audience?.followers ?? 0, icon: Users },
    { title: "Tips received", value: audience?.tipCount ?? 0, icon: Coins },
    { title: "Tipped (APT)", value: formatApt(audience?.tipTotal ?? "0"), icon: Coins },
  ];

  const renderRow = (rows: typeof stats, note: string | null) => (
    <div className="grid grid-cols-2 border-y border-slate-800 md:grid-cols-4">
      {rows.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={`px-3 py-4 sm:px-4 sm:py-5 ${index > 0 ? "border-l border-slate-800" : ""}`}
          >
            <div className="flex items-center gap-2 text-slate-500">
              <Icon size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">{stat.title}</span>
            </div>

            <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>

            {note && <p className="mt-1 text-[11px] text-slate-600">{note}</p>}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {renderRow(stats, walletConnected ? null : "Demo data")}

      {walletConnected && renderRow(audienceStats, null)}
    </>
  );
}
