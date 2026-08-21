"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import AssetCard from "./AssetCard";

import { useStorage } from "@/hooks/useStorage";
import { useWallet } from "@/context/WalletContext";
import type { UploadedAsset } from "@/lib/services/storage";

interface Props {
  assets: UploadedAsset[];
}

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

  const initialRefreshDone =
    useRef(false);

  /*
   * Automatically sync the Asset Manager
   * with Shelby when the list first loads.
   *
   * The ref prevents this from running
   * repeatedly on every render.
   */
  useEffect(() => {
    if (!walletConnected || !walletAddress) {
      return;
    }

    if (
      lastRefreshedWallet.current === walletAddress
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

  if (assets.length === 0) {
    return (
      <div className="min-w-0 rounded-2xl border border-dashed border-slate-700 p-10 text-center">
        <div className="flex flex-col items-center">
          <p className="text-slate-400">
            No assets uploaded yet.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Upload a file to Shelby Storage.
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
    <div className="space-y-4">
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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

      {assets.map((asset) => (
        <AssetCard
          key={asset.uid}
          asset={asset}
        />
      ))}
    </div>
  );
}
