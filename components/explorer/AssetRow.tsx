"use client";

import {
  Download,
  HardDrive,
} from "lucide-react";

import { UploadedAsset } from "@/lib/services/storage";

interface Props {
  asset: UploadedAsset;
}

export default function AssetRow({
  asset,
}: Props) {
  function handleDownload() {
    if (!asset.blobName) {
      console.error(
        "Cannot download asset: blobName is missing."
      );

      return;
    }

    const downloadUrl =
      `/api/shelby/download?blobName=${encodeURIComponent(
        asset.blobName
      )}`;

    window.location.href =
      downloadUrl;
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-600 p-3">
            <HardDrive className="text-white" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {asset.name}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {(asset.size / 1024).toFixed(1)} KB
            </p>

            <p className="text-xs text-slate-500">
              {asset.network}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!asset.blobName}
            className="rounded-xl bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download
              size={16}
              className="mr-2 inline"
            />
            Download
          </button>

          <div className="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-400">
            Stored
          </div>
        </div>
      </div>
    </div>
  );
}