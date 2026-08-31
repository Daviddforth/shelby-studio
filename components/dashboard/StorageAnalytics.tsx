"use client";

import { useMemo } from "react";
import {
  BarChart3,
  File,
  FileText,
  HardDrive,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";
import { useWallet } from "@/context/WalletContext";
import { demoAssets } from "@/components/demo/demoData";

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

  const displayAssets = walletConnected
    ? assets
    : demoAssets;

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

    for (const asset of displayAssets) {
      const size = Number(asset.size) || 0;
      const category = getCategory(asset.name);

      totalBytes += size;

      categories[category].bytes += size;
      categories[category].files += 1;
    }

    return {
      totalBytes,
      totalFiles: displayAssets.length,
      categories,
    };
  }, [displayAssets]);

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
            {walletConnected
              ? "Real storage usage from your Shelby account"
              : "Sample storage usage for the demo workspace"}
          </p>
        </div>

        {!walletConnected && (
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-400">
            Demo
          </span>
        )}

        {walletConnected && loading && (
          <span className="text-xs text-slate-500">
            Loading
          </span>
        )}
      </div>

      {walletConnected && error ? (
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
                              : "files"}{" "}
                            · {formatBytes(value.bytes)}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs font-medium text-slate-400">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${dot}`}
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
