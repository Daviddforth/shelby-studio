"use client";

import {
  CalendarDays,
  Copy,
  Download,
  File,
  Hash,
  HardDrive,
  X,
} from "lucide-react";

import type { UploadedAsset } from "@/lib/services/storage";

interface Props {
  asset: UploadedAsset;
  onClose: () => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shorten(value: string, start = 12, end = 10) {
  if (value.length <= start + end + 3) {
    return value;
  }

  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

export default function AssetDetails({
  asset,
  onClose,
}: Props) {
  async function copyValue(value?: string) {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error(
        "Failed to copy value:",
        error
      );
    }
  }

  function handleDownload() {
    if (!asset.owner || !asset.blobName) {
      return;
    }

    const params = new URLSearchParams({
      owner: asset.owner,
      blobName: asset.blobName,
    });

    window.location.href =
      `/api/shelby/download?${params.toString()}`;
  }

  const canDownload =
    Boolean(
      asset.owner &&
      asset.blobName &&
      asset.status === "Stored"
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 p-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <File size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                Shelby Asset
              </p>

              <h2
                title={asset.name}
                className="mt-1 truncate text-xl font-bold text-white"
              >
                {asset.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-900 hover:text-white"
            aria-label="Close asset details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <HardDrive size={14} />
                Size
              </div>

              <p className="mt-2 text-sm font-medium text-white">
                {formatSize(asset.size)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <File size={14} />
                Network
              </div>

              <p className="mt-2 text-sm font-medium text-white">
                {asset.network}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays size={14} />
                Created
              </div>

              <p className="mt-2 text-sm font-medium text-white">
                {formatDate(asset.uploadedAt)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Status
              </div>

              <p className="mt-2 text-sm font-medium text-emerald-400">
                {asset.status}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  <Hash size={14} />
                  Asset UID
                </div>

                {asset.uid && (
                  <button
                    type="button"
                    onClick={() =>
                      copyValue(asset.uid)
                    }
                    className="text-slate-500 transition hover:text-blue-400"
                    title="Copy UID"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-slate-300">
                {asset.uid || "Not available"}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Owner
                </p>

                {asset.owner && (
                  <button
                    type="button"
                    onClick={() =>
                      copyValue(asset.owner)
                    }
                    className="text-slate-500 transition hover:text-blue-400"
                    title="Copy owner address"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>

              <div
                title={asset.owner}
                className="rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-slate-300"
              >
                {asset.owner
                  ? shorten(asset.owner)
                  : "Not available"}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Shelby Blob Name
                </p>

                {asset.blobName && (
                  <button
                    type="button"
                    onClick={() =>
                      copyValue(asset.blobName)
                    }
                    className="text-slate-500 transition hover:text-blue-400"
                    title="Copy blob name"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>

              <div
                title={asset.blobName}
                className="max-h-24 overflow-auto rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-300"
              >
                {asset.blobName ||
                  "Not available"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-950/80 p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:text-white"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!canDownload}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-400 transition hover:bg-blue-500/20 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
