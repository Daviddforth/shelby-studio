"use client";

import { ImageIcon } from "lucide-react";

interface NFTCardProps {
  name: string;
  collection: string;
  image?: string;
}

export default function NFTCard({
  name,
  collection,
  image,
}: NFTCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 transition hover:border-blue-500 hover:shadow-xl">
      <div className="flex aspect-square items-center justify-center bg-slate-950">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon
            size={64}
            className="text-slate-700"
          />
        )}
      </div>

      <div className="space-y-2 p-5">
        <h3 className="truncate text-lg font-semibold text-white">
          {name}
        </h3>

        <p className="text-sm text-slate-400">
          {collection}
        </p>
      </div>
    </div>
  );
}