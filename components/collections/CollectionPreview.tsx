"use client";

import {
  CheckCircle2,
  FileJson,
  FolderKanban,
  ImageIcon,
  User,
} from "lucide-react";

import { useCollection } from "@/context/CollectionContext";
import { useMetadata } from "@/context/MetadataContext";

export default function CollectionPreview() {
  const {
    collection,
    hasCollection,
    metadataAttached,
  } = useCollection();

  const {
    metadata,
    hasMetadata,
  } = useMetadata();

  const hasAttachedMetadata =
    metadataAttached && hasMetadata;

  /*
   * Empty state
   */
  if (!hasCollection) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <FolderKanban
              size={27}
              className="text-blue-400"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            No Collection Configured
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Add your collection information and branding
            to generate the preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="self-start overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10">

      {/* Banner */}
      <div className="relative aspect-[3/1] w-full overflow-hidden bg-slate-950">
        {collection.banner ? (
          <img
            src={collection.banner}
            alt="Collection banner"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
            <ImageIcon
              size={38}
              className="text-slate-700"
            />
          </div>
        )}

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="p-6">

        {/* Identity */}
        <div className="flex items-start gap-4">

          {/* Collection Logo */}
          <div className="-mt-14 relative z-10 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-slate-900 bg-slate-800 shadow-lg">
            {collection.logo ? (
              <img
                src={collection.logo}
                alt="Collection logo"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FolderKanban
                  size={32}
                  className="text-slate-500"
                />
              </div>
            )}
          </div>

          {/* Collection Identity */}
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-bold text-white">
                {collection.name || "Untitled Collection"}
              </h2>

              {collection.category && (
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                  {collection.category}
                </span>
              )}
            </div>

            {collection.creator && (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
                <User size={14} />

                <span className="truncate">
                  {collection.creator}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {collection.description && (
          <p className="mt-5 text-sm leading-6 text-slate-400">
            {collection.description}
          </p>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
          <div className="border-r border-slate-800 p-4 text-center">
            <p className="text-lg font-semibold text-white">
              {hasAttachedMetadata ? 1 : 0}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              NFTs
            </p>
          </div>

          <div className="border-r border-slate-800 p-4 text-center">
            <p className="text-lg font-semibold text-white">
              {collection.royalty}%
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Royalty
            </p>
          </div>

          <div className="p-4 text-center">
            <p className="text-lg font-semibold text-white">
              {collection.visibility}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Visibility
            </p>
          </div>
        </div>

        {/* Attached Metadata */}
        <div className="mt-6 border-t border-slate-800 pt-6">

          {hasAttachedMetadata ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                  <CheckCircle2 size={16} />

                  Metadata Attached
                </div>

                <span className="text-xs text-slate-500">
                  1 NFT
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">

                {/* NFT Image */}
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                  {metadata.imagePreview ? (
                    <img
                      src={metadata.imagePreview}
                      alt={
                        metadata.name ||
                        "Attached NFT"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FileJson
                        size={24}
                        className="text-slate-600"
                      />
                    </div>
                  )}
                </div>

                {/* NFT Information */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {metadata.name || "Untitled NFT"}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {metadata.attributes.length}{" "}
                    {metadata.attributes.length === 1
                      ? "trait"
                      : "traits"}
                  </p>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900">
                <FileJson
                  size={19}
                  className="text-slate-500"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-300">
                  No metadata attached
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Attach NFT metadata to this collection.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}