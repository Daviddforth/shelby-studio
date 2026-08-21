"use client";

import { useState } from "react";

import {
  Download,
  File,
  FileArchive,
  FileCode2,
  FileImage,
  FileJson,
  FileText,
  FileVideo,
} from "lucide-react";

import type { UploadedAsset } from "@/lib/services/storage";
import AssetDetails from "./AssetDetails";

interface Props {
  asset: UploadedAsset;
}

function getFileName(asset: UploadedAsset) {
  const source = asset.blobName || asset.name;

  if (!source) {
    return "Unnamed asset";
  }

  const parts = source.split("/");
  return parts[parts.length - 1] || source;
}

function getExtension(fileName: string) {
  const parts = fileName.split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts[parts.length - 1].toLowerCase();
}

function getFileType(fileName: string) {
  const extension = getExtension(fileName);

  if (
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
      extension
    )
  ) {
    return "Image";
  }

  if (
    ["mp4", "mov", "avi", "mkv", "webm"].includes(
      extension
    )
  ) {
    return "Video";
  }

  if (extension === "json") {
    return "JSON";
  }

  if (["txt", "md", "csv"].includes(extension)) {
    return "Text";
  }

  if (
    ["zip", "rar", "7z", "tar", "gz"].includes(
      extension
    )
  ) {
    return "Archive";
  }

  if (
    ["ts", "tsx", "js", "jsx", "css", "html"].includes(
      extension
    )
  ) {
    return "Code";
  }

  return extension
    ? extension.toUpperCase()
    : "File";
}

function isImageFile(fileName: string) {
  const extension = getExtension(fileName);

  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
    extension
  );
}

function getImageUrl(asset: UploadedAsset) {
  if (!asset.owner || !asset.blobName) {
    return null;
  }

  const params = new URLSearchParams({
    owner: asset.owner,
    blobName: asset.blobName,
  });

  return `/api/shelby/download?${params.toString()}`;
}

function getFileIcon(fileName: string) {
  const extension = getExtension(fileName);

  if (
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
      extension
    )
  ) {
    return FileImage;
  }

  if (
    ["mp4", "mov", "avi", "mkv", "webm"].includes(
      extension
    )
  ) {
    return FileVideo;
  }

  if (extension === "json") {
    return FileJson;
  }

  if (
    ["txt", "md", "csv"].includes(extension)
  ) {
    return FileText;
  }

  if (
    ["zip", "rar", "7z", "tar", "gz"].includes(
      extension
    )
  ) {
    return FileArchive;
  }

  if (
    ["ts", "tsx", "js", "jsx", "css", "html"].includes(
      extension
    )
  ) {
    return FileCode2;
  }

  return File;
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

  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(2)} GB`;
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AssetRow({
  asset,
}: Props) {
  const [showDetails, setShowDetails] =
    useState(false);

  const fileName = getFileName(asset);
  const fileType = getFileType(fileName);
  const FileIcon = getFileIcon(fileName);
    const imageUrl = isImageFile(fileName) ? getImageUrl(asset) : null;
    const videoUrl = getFileType(fileName) === "Video" ? getImageUrl(asset) : null;

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

  const canDownload = Boolean(
    asset.owner &&
      asset.blobName &&
      asset.status === "Stored"
  );

  return (
    <>
      <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-blue-500/30 hover:bg-slate-900/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-500/10 text-blue-400">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={fileName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : videoUrl ? (
                  <video
                    src={videoUrl}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <FileIcon size={19} />
                )}
            </div>

            <div className="min-w-0">
              <h3
                title={fileName}
                className="truncate text-sm font-semibold text-white"
              >
                {fileName}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                <span>
                  {formatSize(asset.size)}
                </span>

                <span className="text-slate-700">
                  •
                </span>

                <span>{fileType}</span>

                <span className="text-slate-700">
                  •
                </span>

                <span>{asset.network}</span>

                <span className="text-slate-700">
                  •
                </span>

                <span>
                  {formatDate(asset.uploadedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
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
              onClick={() =>
                setShowDetails(true)
              }
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-blue-500 hover:bg-blue-500/5 hover:text-white"
            >
              Details
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!canDownload}
              title={
                canDownload
                  ? "Download asset"
                  : "Asset is not available for download"
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-blue-500 hover:bg-blue-500/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <AssetDetails
          asset={asset}
          onClose={() =>
            setShowDetails(false)
          }
        />
      )}
    </>
  );
}
