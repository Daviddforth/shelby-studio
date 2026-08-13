"use client";

import { ImageIcon } from "lucide-react";
import { useMetadata } from "@/context/MetadataContext";

export default function NFTPreview() {
  const { metadata } = useMetadata();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            Live NFT Preview
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Preview how your metadata will appear.
          </p>
        </div>

        <span className="text-xs text-slate-500">
          {metadata.attributes.length} traits
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <div className="aspect-square max-h-[420px] flex items-center justify-center bg-slate-900">
          {metadata.imagePreview ? (
            <img
              src={metadata.imagePreview}
              alt={metadata.name || "NFT preview"}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon
              size={44}
              className="text-slate-700"
            />
          )}
        </div>

        <div className="p-4">
          <h3 className="text-base font-semibold text-white">
            {metadata.name || "Untitled NFT"}
          </h3>

          <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-slate-400">
            {metadata.description ||
              "Your NFT description will appear here."}
          </p>

          <div className="mt-4">
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400">
              {metadata.collection || "No Collection"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
