"use client";

import { useEffect, useRef, useState } from "react";

import { ImagePlus, X } from "lucide-react";

import {
  DESCRIPTION_MAX,
  TITLE_MAX,
  getFileName,
  getMediaType,
  mediaStreamPath,
  type MediaDetails,
  type MediaKind,
} from "@/lib/media/types";

export interface CoverChoice {
  blobName: string;
}

interface Props {
  owner: string;
  blobName: string;
  kind: MediaKind;
  initial: MediaDetails | null;
  /** The creator's image files that can be used as a cover. */
  covers: CoverChoice[];
  /** Uploads a new cover image with the creator's wallet; returns its blob name. */
  onUploadCover: (file: File) => Promise<string>;
  /** Saves the details (asks the wallet to sign). Throws with a readable message on failure. */
  onSave: (details: MediaDetails) => Promise<void>;
  onClose: () => void;
}

export default function EditMediaDialog({
  owner,
  blobName,
  kind,
  initial,
  covers,
  onUploadCover,
  onSave,
  onClose,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");

  const [description, setDescription] = useState(initial?.description ?? "");

  // A cover chosen earlier may have been deleted since; ignore it then.
  const [coverBlob, setCoverBlob] = useState<string | null>(() =>
    initial?.coverBlob &&
    covers.some((cover) => cover.blobName === initial.coverBlob)
      ? initial.coverBlob
      : null
  );

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  const busy = saving || uploading;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) onClose();
    }

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  async function handleCoverFile(file?: File) {
    if (!file) return;

    setError(null);

    if (getMediaType(file.name)?.kind !== "image") {
      setError("A cover must be an image (jpg, png, gif, webp or avif).");

      return;
    }

    setUploading(true);

    try {
      setCoverBlob(await onUploadCover(file));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not upload the cover."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setError(null);
    setSaving(true);

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        coverBlob,
      });

      onClose();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Could not save."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-media-title"
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:rounded-3xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id="edit-media-title"
              className="text-lg font-semibold text-white"
            >
              Edit details
            </h2>

            <p className="mt-1 truncate text-xs text-slate-500">
              {getFileName(blobName)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-1.5 flex justify-between text-sm font-medium text-slate-300">
              Title
              <span className="text-xs font-normal text-slate-500">
                {title.length}/{TITLE_MAX}
              </span>
            </span>

            <input
              value={title}
              maxLength={TITLE_MAX}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={getFileName(blobName)}
              className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-white outline-none transition focus:border-blue-500"
              autoFocus
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex justify-between text-sm font-medium text-slate-300">
              Description
              <span className="text-xs font-normal text-slate-500">
                {description.length}/{DESCRIPTION_MAX}
              </span>
            </span>

            <textarea
              value={description}
              maxLength={DESCRIPTION_MAX}
              rows={5}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Tell viewers what this is about."
              className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none transition focus:border-blue-500"
            />
          </label>

          {kind !== "image" && (
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  Cover picture
                </span>

                {coverBlob && (
                  <button
                    type="button"
                    onClick={() => setCoverBlob(null)}
                    className="text-xs text-slate-400 transition hover:text-white"
                  >
                    Remove cover
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {covers.map((cover) => {
                  const selected = coverBlob === cover.blobName;

                  return (
                    <button
                      key={cover.blobName}
                      type="button"
                      onClick={() => setCoverBlob(cover.blobName)}
                      aria-pressed={selected}
                      title={getFileName(cover.blobName)}
                      className={`relative aspect-video overflow-hidden rounded-xl border-2 transition ${
                        selected
                          ? "border-blue-500"
                          : "border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mediaStreamPath(owner, cover.blobName)}
                        alt={getFileName(cover.blobName)}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={busy}
                  className="flex aspect-video flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-700 text-xs text-slate-400 transition hover:border-blue-500 hover:text-white disabled:opacity-50"
                >
                  <ImagePlus size={18} />
                  {uploading ? "Uploading…" : "Upload new"}
                </button>
              </div>

              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                className="hidden"
                onChange={(event) => {
                  void handleCoverFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />

              <p className="mt-2 text-xs text-slate-500">
                {covers.length === 0
                  ? "Upload an image to use as the cover. It is stored on Shelby with your wallet."
                  : "Pick one of your images, or upload a new one. Uploading asks your wallet to approve."}
              </p>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="min-h-11 rounded-xl border border-slate-700 px-5 text-sm text-slate-200 transition hover:bg-slate-800 disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={busy}
              className="min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {saving ? "Waiting for wallet…" : "Save"}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Saving asks your wallet to sign a short message. It is free and
            does not send a transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
