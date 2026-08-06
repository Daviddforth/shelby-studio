"use client";

import {
  Download,
  FileText,
} from "lucide-react";

import { useState } from "react";
import { useStorage } from "@/hooks/useStorage";

export default function RecentFiles() {
  const { assets } = useStorage();

  const [downloadingUid, setDownloadingUid] =
    useState<string | null>(null);

  async function handleDownload(asset: {
    uid: string;
    name: string;
    owner?: string;
    blobName?: string;
  }) {
    if (!asset.owner || !asset.blobName) {
      alert(
        "This asset does not contain the Shelby owner/blob information required for download."
      );
      return;
    }

    try {
      setDownloadingUid(asset.uid);

      const params = new URLSearchParams({
        owner: asset.owner,
        blobName: asset.blobName,
      });

      const response = await fetch(
        `/api/shelby/download?${params.toString()}`
      );

      if (!response.ok) {
        let message =
          "Failed to download file from Shelby.";

        try {
          const result = await response.json();

          if (result?.error) {
            message = result.error;
          }
        } catch {
          // Response was not JSON.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

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
      setDownloadingUid(null);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Recent Files
      </h2>

      {assets.length === 0 ? (
        <p className="mt-4 text-slate-400">
          No files uploaded yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {assets.slice(0, 5).map((asset) => {
            const downloading =
              downloadingUid === asset.uid;

            const canDownload =
              Boolean(
                asset.owner &&
                asset.blobName &&
                asset.status === "Stored"
              );

            return (
              <div
                key={asset.uid}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText
                    size={22}
                    className="shrink-0 text-blue-400"
                  />

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {asset.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      {(asset.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-5">
                  <div className="text-right">
                    <p
                      className={
                        asset.status === "Stored"
                          ? "text-sm font-semibold text-green-400"
                          : asset.status === "Failed"
                          ? "text-sm font-semibold text-red-400"
                          : "text-sm font-semibold text-amber-400"
                      }
                    >
                      {asset.status}
                    </p>

                    <p className="text-xs text-slate-500">
                      {asset.network}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={
                      !canDownload ||
                      downloading
                    }
                    onClick={() =>
                      handleDownload(asset)
                    }
                    title={
                      canDownload
                        ? "Download from Shelby"
                        : "Shelby download information unavailable"
                    }
                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Download size={16} />

                    {downloading
                      ? "Downloading..."
                      : "Download"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
