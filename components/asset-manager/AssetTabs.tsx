"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { Clapperboard, Files, HardDrive, Music2, Image as ImageIcon } from "lucide-react";

import { useStorage } from "@/hooks/useStorage";
import { useWallet } from "@/context/WalletContext";

import { getMediaType } from "@/lib/media/types";

import AssetList from "./AssetList";
import AssetHistory from "./AssetHistory";

const tabs = ["Files", "History"] as const;

function formatStorage(bytes: number) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

export default function AssetTabs() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Files");

  const { walletConnected, walletAddress } = useWallet();

  const { assets } = useStorage();

  /* Everything shown here is counted from the wallet's real files. */
  const totals = useMemo(() => {
    const result = { bytes: 0, video: 0, audio: 0, image: 0, other: 0 };

    for (const asset of assets) {
      result.bytes += asset.size || 0;

      const kind = getMediaType(asset.name)?.kind;

      if (kind === "video") result.video += 1;
      else if (kind === "audio") result.audio += 1;
      else if (kind === "image") result.image += 1;
      else result.other += 1;
    }

    return result;
  }, [assets]);

  if (!walletConnected) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center">
        <p className="text-sm font-semibold text-white">
          Connect your wallet to see your files
        </p>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Everything stored on Shelby with your wallet appears here: view,
          download, share and delete.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat icon={Files} label="Total files" value={String(assets.length)} />

        <Stat
          icon={HardDrive}
          label="Storage used"
          value={formatStorage(totals.bytes)}
        />

        <Stat icon={Clapperboard} label="Videos" value={String(totals.video)} />

        <Stat icon={Music2} label="Audio" value={String(totals.audio)} />

        <Stat icon={ImageIcon} label="Images" value={String(totals.image)} />
      </div>

      {(totals.video > 0 || totals.audio > 0 || totals.image > 0) && (
        <p className="text-sm text-slate-400">
          Videos, audio and images get a public page and embed code in your{" "}
          <Link href="/library" className="text-blue-400 hover:text-blue-300">
            Library
          </Link>
          .
          {walletAddress && (
            <>
              {" "}
              Share them all from{" "}
              <Link
                href={`/c/${walletAddress}`}
                className="text-blue-400 hover:text-blue-300"
              >
                your public page
              </Link>
              .
            </>
          )}
        </p>
      )}

      <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
        <div className="flex overflow-x-auto border-b border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`min-w-fit px-4 py-4 text-sm font-semibold transition sm:px-6 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-w-0 p-4 sm:p-6">
          {activeTab === "Files" && <AssetList assets={assets} />}

          {activeTab === "History" && <AssetHistory />}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <Icon size={16} className="text-blue-400" />

      <p className="mt-3 truncate text-xl font-bold text-white">{value}</p>

      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </div>
  );
}
