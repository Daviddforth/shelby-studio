"use client";

import { useRef, useState } from "react";

import {
  CheckCircle2,
  CloudUpload,
  FileText,
  Loader2,
  Plus,
} from "lucide-react";

import { useStorage } from "@/hooks/useStorage";

export default function UploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploadSuccess, setUploadSuccess] =
    useState(false);

  const {
    upload,
    loading,
    progress,
  } = useStorage();

  function handleChooseFile() {
    inputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setUploadSuccess(false);
  }

  async function handleUpload() {
    if (!selectedFile) {
      return;
    }

    try {
      await upload(selectedFile);

      setUploadSuccess(true);
      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      window.setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to upload asset:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unknown Shelby upload error.";

      alert(
        `Shelby upload failed:\n\n${message}`
      );
    }
  }

  function getPhaseLabel() {
    switch (progress?.phase) {
      case "preparing":
        return "Preparing file";

      case "registering":
        return "Registering on Shelby";

      case "uploading":
        return "Uploading to Shelby Storage";

      case "committing":
        return "Finalizing upload";

      case "complete":
        return "Upload complete";

      default:
        return "Preparing upload";
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div>
        <div className="flex items-center gap-2">
          <CloudUpload
            size={17}
            className="text-blue-400"
          />

          <h2 className="text-base font-semibold text-white">
            Upload to Shelby
          </h2>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          Store assets in Shelby Storage.
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-5 py-8 text-center transition hover:border-blue-500/60">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
          <Plus
            size={20}
            className="text-blue-400"
          />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-white">
          Choose a file
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Images, videos, metadata, documents and
          other assets.
        </p>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={handleChooseFile}
          disabled={loading}
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Choose File
        </button>
      </div>

      {selectedFile && (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center gap-3">
            <FileText
              size={20}
              className="shrink-0 text-blue-400"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {selectedFile.name}
              </p>

              <p className="text-xs text-slate-500">
                {formatStorage(selectedFile.size)}
              </p>
            </div>
          </div>

          {loading && progress && (
            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Loader2
                    size={14}
                    className="animate-spin text-blue-400"
                  />

                  {getPhaseLabel()}
                </div>

                <span className="text-xs font-semibold text-blue-400">
                  {progress.percentage}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(
                        100,
                        progress.percentage
                      )
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>
                  {formatStorage(
                    progress.uploadedBytes
                  )}
                  {" / "}
                  {formatStorage(
                    progress.totalBytes
                  )}
                </span>

                {typeof progress.chunksetIdx ===
                  "number" &&
                  typeof progress.totalChunksets ===
                    "number" && (
                    <span>
                      Chunk{" "}
                      {Math.min(
                        progress.chunksetIdx + 1,
                        progress.totalChunksets
                      )}{" "}
                      of{" "}
                      {progress.totalChunksets}
                    </span>
                  )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                {progress
                  ? `${getPhaseLabel()} — ${progress.percentage}%`
                  : "Uploading..."}
              </>
            ) : (
              <>
                <CloudUpload size={16} />

                Upload to Shelby
              </>
            )}
          </button>
        </div>
      )}

      {uploadSuccess && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
          <CheckCircle2 size={17} />

          <span className="text-sm font-medium">
            File successfully stored on Shelby.
          </span>
        </div>
      )}
    </section>
  );
}

function formatStorage(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) / Math.log(1024)
    ),
    units.length - 1
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(
    index === 0 ? 0 : 2
  )} ${units[index]}`;
}
