"use client";

import {
  FileText,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { UploadedAsset } from "@/lib/services/storage";
import { useStorage } from "@/hooks/useStorage";
import { useMetadata } from "@/context/MetadataContext";

import AssetDetails from "./AssetDetails";

interface Props {
  asset: UploadedAsset;
}

export default function AssetCard({
  asset,
}: Props) {
  const router = useRouter();

  const [downloading, setDownloading] =
    useState(false);

  const [replacing, setReplacing] =
    useState(false);

  const [showDetails, setShowDetails] =
    useState(false);

  const replaceInputRef =
    useRef<HTMLInputElement>(null);

  const {
    remove,
    replace,
    deletingUid,
  } = useStorage();

  const {
    setMetadata,
  } = useMetadata();

  const deleting =
    deletingUid === asset.uid;

  const canDownload =
    Boolean(
      asset.owner &&
      asset.blobName &&
      asset.status === "Stored"
    );

  const canUseForMetadata =
    Boolean(
      asset.owner &&
      asset.blobName &&
      asset.status === "Stored"
    );

  function handleUseForMetadata() {
    if (!canUseForMetadata) {
      alert(
        "This asset does not have the Shelby information required for metadata."
      );

      return;
    }

    /*
     * Store the Shelby blob reference in the
     * metadata image field.
     *
     * imagePreview remains empty because this
     * asset was selected from Shelby Storage,
     * rather than uploaded directly from the browser.
     */
    setMetadata((previous) => ({
      ...previous,

      image:
        asset.blobName || "",

      imagePreview: "",
    }));

    router.push("/metadata");
  }

  async function handleDelete() {
    if (deleting) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${asset.name}" from Shelby? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      await remove(asset.uid);
    } catch (error) {
      console.error(
        "Failed to delete Shelby asset:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete Shelby asset."
      );
    }
  }

  function handleReplaceClick() {
    if (deleting || replacing) {
      return;
    }

    replaceInputRef.current?.click();
  }

  async function handleReplace(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const confirmed =
      window.confirm(
        `Replace "${asset.name}" with "${file.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setReplacing(true);

      await replace(
        asset.uid,
        file
      );

      alert(
        "Asset replaced successfully."
      );
    } catch (error) {
      console.error(
        "Failed to replace Shelby asset:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to replace Shelby asset."
      );
    } finally {
      setReplacing(false);
    }
  }

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
    <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

        <div className="flex w-fit shrink-0 items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
          <CheckCircle2 size={18} />

          {asset.status}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <button
          type="button"
          onClick={() =>
            setShowDetails(
              (previous) => !previous
            )
          }
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800 sm:w-auto"
        >
          {showDetails
            ? "Hide Details"
            : "Details"}
        </button>

        <button
          type="button"
          disabled={
            !canDownload ||
            downloading
          }
          onClick={handleDownload}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <Download size={16} />

          {downloading
            ? "Downloading..."
            : "Download"}
        </button>

        <button
          type="button"
          disabled={!canUseForMetadata}
          onClick={handleUseForMetadata}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <ImageIcon size={16} />
          Use for Metadata
          <ArrowRight size={15} />
        </button>

        <button
          type="button"
          disabled={
            deleting ||
            replacing
          }
          onClick={handleReplaceClick}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <RefreshCw
            size={16}
            className={
              replacing
                ? "animate-spin"
                : ""
            }
          />

          {replacing
            ? "Replacing..."
            : "Replace"}
        </button>

        <button
          type="button"
          disabled={deleting}
          onClick={handleDelete}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <Trash2 size={16} />

          {deleting
            ? "Deleting..."
            : "Delete"}
        </button>

        <input
          ref={replaceInputRef}
          type="file"
          className="hidden"
          onChange={handleReplace}
        />
      </div>

      {showDetails && (
        <AssetDetails
          asset={asset}
          onClose={() =>
            setShowDetails(false)
          }
        />
      )}
    </div>
  );
}
