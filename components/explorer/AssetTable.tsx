"use client";

import { useEffect, useMemo, useState } from "react";

import { useWallet } from "@/context/WalletContext";
import { useStorageContext } from "@/context/StorageContext";
import type { UploadedAsset } from "@/lib/services/storage";

import AssetRow from "./AssetRow";

interface AssetTableProps {
  status: string;
  sort: string;
  ownerAddress?: string;
}

export default function AssetTable({
  status,
  sort,
  ownerAddress,
}: AssetTableProps) {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const { search } =
    useStorageContext();

  const [assets, setAssets] =
    useState<UploadedAsset[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const explorerAddress =
    ownerAddress?.trim() ||
    (walletConnected
      ? walletAddress?.trim()
      : "") ||
    "";

  useEffect(() => {
    let cancelled = false;

    async function loadShelbyAssets() {
      if (!explorerAddress) {
        setAssets([]);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            `/api/shelby/assets?walletAddress=${encodeURIComponent(
              explorerAddress
            )}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        let result: {
          success?: boolean;
          error?: string;
          assets?: UploadedAsset[];
        } = {};

        try {
          result =
            await response.json();
        } catch {
          // Ignore invalid JSON responses.
        }

        if (
          !response.ok ||
          !result.success ||
          !Array.isArray(result.assets)
        ) {
          throw new Error(
            result.error ||
              "Failed to load assets from Shelby."
          );
        }

        if (!cancelled) {
          setAssets(result.assets);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load Shelby Explorer assets:",
          error
        );

        setAssets([]);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load Shelby assets."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadShelbyAssets();

    return () => {
      cancelled = true;
    };
  }, [explorerAddress]);

  const filteredAssets =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      const result =
        assets.filter((asset) => {
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

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-12 text-center">
        <p className="text-sm text-slate-400">
          Loading blobs from Shelby...
        </p>

        <p className="mt-2 text-xs text-slate-600">
          Reading public storage metadata for
          this account.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
        <h2 className="text-base font-semibold text-red-400">
          Failed to load Shelby account
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
          {error}
        </p>
      </div>
    );
  }

  if (
    filteredAssets.length === 0
  ) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-12 text-center">
        <h2 className="text-base font-semibold text-white">
          {assets.length === 0
            ? "No stored blobs found"
            : "No matching blobs"}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          {assets.length === 0
            ? "This Shelby account does not currently have any blobs returned by the Shelbynet coordination layer."
            : "Try changing your search term or filters to find another blob."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="px-1 text-xs text-slate-500">
        {filteredAssets.length}{" "}
        {filteredAssets.length === 1
          ? "blob"
          : "blobs"}{" "}
        found on Shelby
      </p>

      {filteredAssets.map(
        (asset) => (
          <AssetRow
            key={
              asset.uid ||
              asset.blobName ||
              asset.name
            }
            asset={asset}
          />
        )
      )}
    </div>
  );
}
