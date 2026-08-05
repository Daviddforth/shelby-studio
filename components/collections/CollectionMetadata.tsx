"use client";

import { CheckSquare } from "lucide-react";
import { useMetadata } from "@/context/MetadataContext";

export default function CollectionMetadata() {
  const { metadata } = useMetadata();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center gap-3">
        <CheckSquare
          size={28}
          className="text-blue-400"
        />

        <h2 className="text-2xl font-bold text-white">
          Attached Metadata
        </h2>
      </div>

      <p className="mt-2 text-slate-400">
        Metadata that will be included in this collection.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
        {metadata.name ? (
          <>
            <h3 className="text-xl font-semibold text-white">
              {metadata.name}
            </h3>

            <p className="mt-2 text-slate-400">
              {metadata.description ||
                "No description provided."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
                {metadata.collection || "Unassigned"}
              </span>

              <span className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300">
                {metadata.attributes.length} Traits
              </span>
            </div>
          </>
        ) : (
          <div className="py-10 text-center">
            <p className="text-slate-400">
              No metadata available.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Create metadata first, then attach it to this collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}