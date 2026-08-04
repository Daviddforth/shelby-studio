"use client";

import { useStorageContext } from "@/context/StorageContext";
import AssetRow from "./AssetRow";

export default function AssetTable() {
  const {
    assets,
    search,
  } = useStorageContext();

  const filteredAssets = assets.filter((asset) =>
    asset.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (filteredAssets.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
        <h2 className="text-2xl font-semibold text-white">
          {assets.length === 0
            ? "No Assets Yet"
            : "No Matching Assets"}
        </h2>

        <p className="mt-3 text-slate-400">
          {assets.length === 0
            ? "Upload files from the Storage page and they will appear here automatically."
            : "Try a different search term."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAssets.map((asset) => (
        <AssetRow
          key={asset.uid}
          asset={asset}
        />
      ))}
    </div>
  );
}