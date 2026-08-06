"use client";

import {
  CheckCircle2,
  FileJson,
  Link2,
  Unlink,
} from "lucide-react";

import { useMetadata } from "@/context/MetadataContext";
import { useCollection } from "@/context/CollectionContext";

export default function CollectionMetadata() {
  const {
    metadata,
    hasMetadata,
  } = useMetadata();

  const {
    metadataAttached,
    attachMetadata,
    detachMetadata,
  } = useCollection();

  /*
   * No metadata has been created for
   * the active project yet.
   */
  if (!hasMetadata) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex items-center gap-3">
          <FileJson
            size={28}
            className="text-blue-400"
          />

          <h2 className="text-2xl font-bold text-white">
            Attached Metadata
          </h2>
        </div>

        <p className="mt-2 text-slate-400">
          Attach NFT metadata from the active project
          to this collection.
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
          <FileJson
            size={34}
            className="mx-auto text-slate-600"
          />

          <p className="mt-4 font-medium text-slate-300">
            No metadata available
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Create metadata for this project first,
            then return here to attach it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <FileJson
              size={28}
              className="text-blue-400"
            />

            <h2 className="text-2xl font-bold text-white">
              Attached Metadata
            </h2>
          </div>

          <p className="mt-2 text-slate-400">
            Attach NFT metadata from the active project
            to this collection.
          </p>
        </div>

        {metadataAttached && (
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
            <CheckCircle2 size={15} />
            Attached
          </span>
        )}
      </div>

      <div
        className={`mt-8 rounded-2xl border p-6 ${
          metadataAttached
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-slate-800 bg-slate-950"
        }`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Project Metadata
            </p>

            <h3 className="mt-2 truncate text-xl font-semibold text-white">
              {metadata.name || "Untitled NFT"}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
              {metadata.description ||
                "No description provided."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {metadata.collection && (
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm text-blue-400">
                  {metadata.collection}
                </span>
              )}

              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                {metadata.attributes.length}{" "}
                {metadata.attributes.length === 1
                  ? "Trait"
                  : "Traits"}
              </span>
            </div>
          </div>

          {metadata.imagePreview && (
            <img
              src={metadata.imagePreview}
              alt={metadata.name || "NFT preview"}
              className="h-24 w-24 shrink-0 rounded-xl border border-slate-700 object-cover"
            />
          )}
        </div>

        <div className="mt-6 border-t border-slate-800 pt-5">
          {!metadataAttached ? (
            <button
              type="button"
              onClick={attachMetadata}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              <Link2 size={18} />
              Attach to Collection
            </button>
          ) : (
            <button
              type="button"
              onClick={detachMetadata}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 font-medium text-red-400 transition hover:bg-red-500/20"
            >
              <Unlink size={18} />
              Remove from Collection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}