"use client";

import { useMemo } from "react";

import { useStorageContext } from "@/context/StorageContext";
import AssetRow from "./AssetRow";

interface AssetTableProps {
  status: string;
  sort: string;
}

export default function AssetTable({
  status,
  sort,
}: AssetTableProps) {
  const {
    assets,
    search,
  } = useStorageContext();

  const filteredAssets = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    const result = assets.filter((asset) => {
      const matchesSearch =
        !query ||
        asset.name
          .toLowerCase()
          .includes(query) ||
        asset.blobName
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "all" ||
        asset.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            new Date(a.uploadedAt).getTime() -
            new Date(b.uploadedAt).getTime()
          );

        case "name":
          return a.name.localeCompare(b.name);

        case "largest":
          return b.size - a.size;

        case "smallest":
          return a.size - b.size;

        default:
          return (
            new Date(b.uploadedAt).getTime() -
            new Date(a.uploadedAt).getTime()
          );
      }
    });
  }, [
    assets,
    search,
    status,
    sort,
  ]);

  if (filteredAssets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-12 text-center">
        <h2 className="text-base font-semibold text-white">
          {assets.length === 0
            ? "No assets yet"
            : "No matching assets"}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          {assets.length === 0
            ? "Upload files from the Storage page and they will appear here."
            : "Try changing your search term or filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="px-1 text-xs text-slate-500">
        {filteredAssets.length}{" "}
        {filteredAssets.length === 1
          ? "asset"
          : "assets"}
      </p>

      {filteredAssets.map((asset) => (
        <AssetRow
          key={asset.uid}
          asset={asset}
        />
      ))}
    </div>
  );
}
