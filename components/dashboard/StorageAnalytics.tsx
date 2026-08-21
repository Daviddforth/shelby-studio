"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  File,
  FileText,
  HardDrive,
  Image as ImageIcon,
  Loader2,
  Video,
} from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";
import { useWallet } from "@/context/WalletContext";

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

function getCategory(name: string) {
  const extension =
    name.split(".").pop()?.toLowerCase() ?? "";

  if (
    [
      "png",
      "jpg",
      "jpeg",
      "gif",
      "webp",
      "svg",
      "bmp",
      "avif",
    ].includes(extension)
  ) {
    return "Images";
  }

  if (
    [
      "mp4",
      "mov",
      "avi",
      "mkv",
      "webm",
      "m4v",
    ].includes(extension)
  ) {
    return "Videos";
  }

  if (
    [
      "json",
      "txt",
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "csv",
      "md",
    ].includes(extension)
  ) {
    return "Documents";
  }

  return "Other";
}

export default function StorageAnalytics() {
  const { walletConnected, network } = useWallet();

  const {
    assets,
    loading,
    error,
  } = useStorageContext();

  const stats = useMemo(() => {
    const categories = {
      Images: {
        bytes: 0,
        files: 0,
      },
      Videos: {
        bytes: 0,
        files: 0,
      },
      Documents: {
        bytes: 0,
        files: 0,
      },
      Other: {
        bytes: 0,
        files: 0,
      },
    };

    let totalBytes = 0;

    for (const asset of assets) {
      const size = Number(asset.size) || 0;
      const category = getCategory(asset.name);

      totalBytes += size;

      categories[category].bytes += size;
      categories[category].files += 1;
    }

    return {
      totalBytes,
      totalFiles: assets.length,
      categories,
    };
  }, [assets]);

  const categoryItems = [
    {
      name: "Images",
      icon: ImageIcon,
      value: stats.categories.Images,
      dot: "bg-blue-500",
    },
    {
      name: "Videos",
      icon: Video,
      value: stats.categories.Videos,
      dot: "bg-violet-500",
    },
    {
      name: "Documents",
      icon: FileText,
      value: stats.categories.Documents,
      dot: "bg-emerald-500",
    },
    {
      name: "Other",
      icon: File,
      value: stats.categories.Other,
      dot: "bg-slate-500",
    },
  ];

  const circumference = 2 * Math.PI * 46;

  const donutSegments = useMemo(() => {
    let offset = 0;

    return categoryItems.map((item) => {
      const percentage =
        stats.totalBytes > 0
          ? (item.value.bytes / stats.totalBytes) * 100
          : 0;

      const length =
        (percentage / 100) * circumference;

      const segment = {
        ...item,
        percentage,
        length,
        offset,
      };

      offset += length;

      return segment;
    });
  }, [stats.totalBytes, stats.categories]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3
              size={17}
              className="text-blue-400"
            />

            <h2 className="text-base font-semibold text-white">
              Storage Statistics
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Real storage usage from your Shelby account
          </p>
        </div>

        {loading && (
          <Loader2
            size={16}
            className="animate-spin text-slate-500"
          />
        )}
      </div>

      {!walletConnected ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-800 px-5 py-10 text-center">
          <HardDrive
            size={24}
            className="mx-auto text-slate-600"
          />

          <p className="mt-3 text-sm font-medium text-white">
            Connect your wallet
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Connect a wallet to view your real Shelby storage analytics.
          </p>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-red-900/50 bg-red-950/20 px-5 py-7 text-center">
          <p className="text-sm font-medium text-red-300">
            Unable to load storage
          </p>

          <p className="mt-1 text-xs text-red-400/70">
            {error}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
          {/* Donut */}
          <div className="flex justify-center">
            <div className="relative h-48 w-48">
              <svg
                viewBox="0 0 120 120"
                className="h-full w-full -rotate-90"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-800"
                />

                {stats.totalBytes > 0 &&
                  donutSegments.map(
                    ({
                      name,
                      length,
                      offset,
                    }) => (
                      <circle
                        key={name}
                        cx="60"
                        cy="60"
                        r="46"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="butt"
                        strokeDasharray={`${length} ${circumference - length}`}
                        strokeDashoffset={-offset}
                        className={
                          name === "Images"
                            ? "text-blue-500"
                            : name === "Videos"
                            ? "text-violet-500"
                            : name === "Documents"
                            ? "text-emerald-500"
                            : "text-slate-500"
                        }
                      />
                    )
                  )}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold tracking-tight text-white">
                  {formatBytes(stats.totalBytes)}
                </span>

                <span className="mt-1 text-[11px] text-slate-500">
                  Storage Used
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="min-w-0">
            <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs text-slate-500">
                  Total Files
                </p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {stats.totalFiles}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500">
                  Shelby Network
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {network}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {donutSegments.map(
                ({
                  name,
                  icon: Icon,
                  value,
                  percentage,
                  dot,
                }) => (
                  <div
                    key={name}
                    className="group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${dot}`}
                        />

                        <Icon
                          size={15}
                          className="shrink-0 text-slate-500"
                        />

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-300">
                            {name}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-600">
                            {value.files}{" "}
                            {value.files === 1
                              ? "file"
                              : "files"}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs font-medium text-slate-300">
                          {formatBytes(value.bytes)}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-600">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${dot}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
