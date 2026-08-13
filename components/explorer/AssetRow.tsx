"use client";

import {
  Download,
  HardDrive,
} from "lucide-react";

import type { UploadedAsset } from "@/lib/services/storage";

interface Props {
  asset: UploadedAsset;
}

export default function AssetRow({
  asset,
}: Props) {
  function handleDownload() {
    if (!asset.owner || !asset.blobName) {
      console.error(
        "Cannot download asset: owner or blobName is missing."
      );

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-blue-500/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <HardDrive
              size={18}
              className="text-blue-400"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-white">
              {asset.name}
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              {(asset.size / 1024).toFixed(1)} KB
              <span className="mx-1.5 text-slate-700">
                •
              </span>
              {asset.network}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
              asset.status === "Stored"
                ? "bg-emerald-500/10 text-emerald-400"
                : asset.status === "Failed"
                ? "bg-red-500/10 text-red-400"
                : "bg-amber-500/10 text-amber-400"
            }`}
          >
            {asset.status}
          </span>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!canDownload}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
