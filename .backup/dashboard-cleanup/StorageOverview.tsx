"use client";

import { useEffect, useState } from "react";
import { HardDrive, Loader2 } from "lucide-react";

import { useWallet } from "@/context/WalletContext";

interface StorageData {
  count: number;
  assets: Array<{
    size: number;
  }>;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 2
  )} ${units[index]}`;
}

export default function StorageOverview() {
  const { walletConnected, walletAddress, network } = useWallet();

  const [data, setData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!walletConnected || !walletAddress) {
      setData(null);
      setError(false);
      return;
    }

    let cancelled = false;
    const address = walletAddress;

    async function loadStorage() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          `/api/shelby/assets?walletAddress=${encodeURIComponent(
            address
          )}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Unable to load Shelby storage."
          );
        }

        if (!cancelled) {
          setData({
            count: Number(result.count) || 0,
            assets: Array.isArray(result.assets)
              ? result.assets
              : [],
          });
        }
      } catch (err) {
        console.error("Failed to load storage overview:", err);

        if (!cancelled) {
          setData(null);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadStorage();

    return () => {
      cancelled = true;
    };
  }, [walletConnected, walletAddress]);

  const totalBytes =
    data?.assets.reduce(
      (sum, asset) => sum + (Number(asset.size) || 0),
      0
    ) ?? 0;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HardDrive
              size={17}
              strokeWidth={1.8}
              className="text-blue-400"
            />

            <h2 className="text-base font-semibold text-white">
              Storage
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Shelby Storage usage
          </p>
        </div>

        {loading ? (
          <Loader2
            size={16}
            className="animate-spin text-slate-500"
          />
        ) : (
          <span className="text-sm font-medium text-slate-300">
            {formatBytes(totalBytes)}
          </span>
        )}
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{
            width:
              totalBytes > 0
                ? "100%"
                : "0%",
          }}
        />
      </div>

      <div className="mt-5 flex items-center gap-7 text-xs">
        <div>
          <span className="text-slate-500">Files</span>

          <p className="mt-1 font-medium text-white">
            {data?.count ?? 0}
          </p>
        </div>

        <div>
          <span className="text-slate-500">Network</span>

          <p className="mt-1 font-medium text-white">
            {network}
          </p>
        </div>

        <div>
          <span className="text-slate-500">Status</span>

          <p
            className={
              error
                ? "mt-1 font-medium text-red-400"
                : "mt-1 font-medium text-emerald-400"
            }
          >
            {error
              ? "Unavailable"
              : walletConnected
                ? "Connected"
                : "Waiting"}
          </p>
        </div>
      </div>
    </section>
  );
}
