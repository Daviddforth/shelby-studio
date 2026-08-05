"use client";

import {
  ImageIcon,
  Pencil,
  Trash2,
  Copy,
} from "lucide-react";

interface PortfolioCardProps {
  title: string;
  description: string;
  image?: string;
  collection?: string;
}

export default function PortfolioCard({
  title,
  description,
  image,
  collection,
}: PortfolioCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 transition hover:border-blue-500">
      {/* Preview */}
      <div className="aspect-square bg-slate-950">
        {image ? (
          <img
            src={image}
            alt={title}
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

      {/* Body */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-slate-400">
          {description}
        </p>

        <div className="mt-4">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white">
            {collection || "No Collection"}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <button className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700">
            <Pencil size={18} />
          </button>

          <button className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700">
            <Copy size={18} />
          </button>

          <button className="rounded-lg bg-slate-800 p-2 text-red-400 hover:bg-red-600 hover:text-white">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}