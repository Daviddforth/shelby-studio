"use client";

import { FileJson, Sparkles } from "lucide-react";

export default function MetadataHeader() {
  return (
    <div className="flex min-w-0 flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
          <FileJson size={18} className="text-blue-400" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-blue-400">
            Shelby Studio
          </p>

          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-white">
            Metadata Builder
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create, validate and export structured NFT metadata.
          </p>
        </div>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-yellow-300">
        <Sparkles size={14} />
        AI Ready
      </div>
    </div>
  );
}
