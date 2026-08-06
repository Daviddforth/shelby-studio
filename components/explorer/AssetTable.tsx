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

  const filteredAssets =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      const result = assets.filter(
        (asset) => {
          /*
           * Search both the visible filename
           * and the real Shelby blob path.
           */
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
        }
      );

      return [...result].sort(
        (a, b) => {
          switch (sort) {
            case "oldest":
              return (
                new Date(
                  a.uploadedAt
                ).getTime() -
                new Date(
                  b.uploadedAt
                ).getTime()
              );

            case "name":
              return a.name.localeCompare(
                b.name
              );

            case "largest":
              return b.size - a.size;

            case "smallest":
              return a.size - b.size;

            case "newest":
            default:
              return (
                new Date(
                  b.uploadedAt
                ).getTime() -
                new Date(
                  a.uploadedAt
                ).getTime()
              );
          }
        }
      );
    }, [
      assets,
      search,
      status,
      sort,
    ]);

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
            : "Try changing your search term or filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-slate-400">
          {filteredAssets.length}{" "}
          {filteredAssets.length === 1
            ? "asset"
            : "assets"}
        </p>
      </div>

      {filteredAssets.map(
        (asset) => (
          <AssetRow
            key={asset.uid}
            asset={asset}
          />
        )
      )}
    </div>
  );
}
