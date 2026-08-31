"use client";

import {
  Filter,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AssetCard from "./AssetCard";

import { useStorage } from "@/hooks/useStorage";
import { useWallet } from "@/context/WalletContext";

import type {
  UploadedAsset,
} from "@/lib/services/storage";

interface Props {
  assets: UploadedAsset[];
}

type StatusFilter =
  | "All"
  | "Stored"
  | "Uploading"
  | "Failed";

export default function AssetList({
  assets,
}: Props) {
  const lastRefreshedWallet =
    useRef<string | null>(null);

  const {
    refreshAssets,
  } = useStorage();

  const {
    walletAddress,
    walletConnected,
  } = useWallet();

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  /*
   * Automatically synchronize assets
   * with Shelby when the wallet loads.
   */
  useEffect(() => {
    if (
      !walletConnected ||
      !walletAddress
    ) {
      return;
    }

    if (
      lastRefreshedWallet.current ===
      walletAddress
    ) {
      return;
    }

    lastRefreshedWallet.current =
      walletAddress;

    async function loadAssets() {
      setRefreshing(true);

      try {
        await refreshAssets();
      } catch (error) {
        console.warn(
          "Shelby asset refresh skipped:",
          error
        );
      } finally {
        setRefreshing(false);
      }
    }

    void loadAssets();
  }, [
    walletConnected,
    walletAddress,
    refreshAssets,
  ]);

  /*
   * Filter assets locally.
   *
   * Search supports:
   * - file name
   * - UID
   * - blob name
   */
  const filteredAssets = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesSearch =
        normalizedSearch === "" ||
        asset.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        asset.uid
          .toLowerCase()
          .includes(normalizedSearch) ||
        (
          asset.blobName
            ?.toLowerCase()
            .includes(
              normalizedSearch
            ) ?? false
        );

      const matchesStatus =
        statusFilter === "All" ||
        asset.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    assets,
    search,
    statusFilter,
  ]);

  async function handleRefresh() {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    try {
      await refreshAssets();
    } catch (error) {
      console.error(
        "Failed to refresh Shelby assets:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to refresh Shelby assets."
      );
    } finally {
      setRefreshing(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
  }

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "All";

  /*
   * No assets exist.
   */
  if (assets.length === 0) {
    return (
      <div className="min-w-0 rounded-2xl border border-dashed border-slate-700 p-10 text-center">
        <div className="flex flex-col items-center">
          <p className="text-slate-400">
            No stored assets yet.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Upload files from the Storage workspace
            and they will appear here.
          </p>

          {refreshing && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <RefreshCw
                size={14}
                className="animate-spin"
              />

              Checking Shelby Storage...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5">
      {/* Search and filter controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by file name, UID, or blob name..."
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-10 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex min-w-0 items-center gap-2">
            <Filter
              size={16}
              className="shrink-0 text-slate-500"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter
                )
              }
              className="h-11 min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-40 sm:flex-none"
            >
              <option value="All">
                All statuses
              </option>

              <option value="Stored">
                Stored
              </option>

              <option value="Uploading">
                Uploading
              </option>

              <option value="Failed">
                Failed
              </option>
            </select>
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 flex flex-col gap-2 border-t border-slate-800 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-300">
              {filteredAssets.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-300">
              {assets.length}
            </span>{" "}
            assets
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex w-fit items-center gap-1.5 text-slate-400 transition hover:text-white"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* No search/filter results */}
      {filteredAssets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
          <Search
            size={24}
            className="mx-auto text-slate-600"
          />

          <p className="mt-3 text-sm font-medium text-white">
            No matching assets
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Try a different search term or change
            the status filter.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.uid}
              asset={asset}
            />
          ))}
        </div>
      )}
    </div>
  );
}
