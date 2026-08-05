"use client";

import {
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
  } = useCollection();

  const { metadata } = useMetadata();

  /*
   * Do not make an empty collection look
   * like real user-created content.
   */
  if (!hasCollection) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
            <FolderKanban
              size={30}
              className="text-blue-400"
            />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-white">
            No Collection Configured
          </h2>

          <p className="mt-3 leading-6 text-slate-400">
            Enter your collection information to
            generate a live preview here.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-500">
            Preview waiting for collection data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
      {/* Banner */}
      <div className="h-52 bg-slate-800">
        {collection.banner ? (
          <img
            src={collection.banner}
            alt="Collection banner"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon
              size={60}
              className="text-slate-600"
            />
          </div>
        )}
      </div>

      <div className="p-8">
        {/* Logo */}
        <div className="-mt-20 mb-6 flex justify-center">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-slate-900 bg-slate-800">
            {collection.logo ? (
              <img
                src={collection.logo}
                alt="Collection logo"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <FolderKanban
                  size={42}
                  className="text-slate-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Real Collection Name */}
        {collection.name && (
          <h2 className="text-center text-3xl font-bold text-white">
            {collection.name}
          </h2>
        )}

        {/* Real Creator */}
        {collection.creator && (
          <div className="mt-3 flex items-center justify-center gap-2 text-slate-400">
            <User size={16} />

            {collection.creator}
          </div>
        )}

        {/* Real Description */}
        {collection.description && (
          <p className="mt-6 text-center text-slate-400">
            {collection.description}
          </p>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-950 p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {metadata.name ? 1 : 0}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              NFTs
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {collection.royalty}%
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Royalty
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {collection.visibility}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Visibility
            </p>
          </div>
        </div>

        {/* Category */}
        {collection.category && (
          <div className="mt-8 flex justify-center">
            <span className="rounded-full bg-blue-600 px-4 py-2 text-white">
              {collection.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
