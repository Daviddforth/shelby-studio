"use client";

import { ImageIcon } from "lucide-react";
import { useMetadata } from "@/context/MetadataContext";

export default function NFTPreview() {
  const { metadata } = useMetadata();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Live NFT Preview
      </h2>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">

        <div className="aspect-square flex items-center justify-center bg-slate-900">
          {metadata.imagePreview ? (
            <img
              src={metadata.imagePreview}
              alt={metadata.name || "NFT preview"}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon
              size={64}
              className="text-slate-600"
            />
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-white">
            {metadata.name || "Untitled NFT"}
          </h3>

          <p className="mt-2 text-slate-400">
            {metadata.description ||
              "Your NFT description will appear here."}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <span className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
              {metadata.collection || "No Collection"}
            </span>

            <span className="text-sm text-slate-500">
              {metadata.attributes.length} Traits
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}