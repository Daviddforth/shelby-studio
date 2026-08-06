"use client";

import AssetCard from "./AssetCard";
import type { UploadedAsset } from "@/lib/services/storage";

interface Props {
  assets: UploadedAsset[];
}

export default function AssetList({
  assets,
}: Props) {
  if (assets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
        <p className="text-slate-400">
          No assets uploaded yet.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Upload a file to Shelby Storage.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <AssetCard
          key={asset.uid}
          asset={asset}
        />
      ))}
    </div>
  );
}
