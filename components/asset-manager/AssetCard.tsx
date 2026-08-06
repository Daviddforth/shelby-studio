"use client";

import {
  FileText,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import { useState } from "react";
import type { UploadedAsset } from "@/lib/services/storage";

interface Props {
  asset: UploadedAsset;
}

export default function AssetCard({
  asset,
}: Props) {
  const [downloading, setDownloading] =
    useState(false);

  const canDownload =
    Boolean(
      asset.owner &&
      asset.blobName &&
      asset.status === "Stored"
    );

  async function handleDownload() {
    if (
      !asset.owner ||
      !asset.blobName
    ) {
      alert(
        "Shelby owner/blob information is unavailable for this asset."
      );

      return;
    }

    try {
      setDownloading(true);

      const params =
        new URLSearchParams({
          owner: asset.owner,
          blobName: asset.blobName,
        });

      const response =
        await fetch(
          `/api/shelby/download?${params.toString()}`
        );

      if (!response.ok) {
        let message =
          "Failed to download file from Shelby.";

        try {
          const result =
            await response.json();

          if (result?.error) {
            message = result.error;
          }
        } catch {
          // Response was not JSON.
        }

        throw new Error(message);
      }

      const blob =
        await response.blob();

      const objectUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = objectUrl;
      link.download = asset.name;

      document.body.appendChild(link);

      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(
        "Failed to download Shelby asset:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to download Shelby asset."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <FileText
            size={28}
            className="shrink-0 text-blue-400"
          />

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white">
              {asset.name}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {(asset.size / 1024).toFixed(1)} KB
            </p>

            <p className="mt-1 break-all text-xs text-slate-500">
              UID: {asset.uid}
            </p>

            <p className="text-xs text-slate-500">
              Network: {asset.network}
            </p>

            <p className="text-xs text-slate-500">
              Uploaded:{" "}
              {new Date(
                asset.uploadedAt
              ).toLocaleString()}
            </p>

            {asset.blobName && (
              <p className="mt-1 break-all text-xs text-slate-500">
                Blob: {asset.blobName}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-green-400">
          <CheckCircle2 size={18} />

          {asset.status}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={
            !canDownload ||
            downloading
          }
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={16} />

          {downloading
            ? "Downloading..."
            : "Download"}
        </button>

        <button
          type="button"
          disabled
          title="Replace will be connected next"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white opacity-50"
        >
          <RefreshCw size={16} />
          Replace
        </button>

        <button
          type="button"
          disabled
          title="Delete will be connected next"
          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm text-white opacity-50"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
