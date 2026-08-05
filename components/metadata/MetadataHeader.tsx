"use client";

import { FileJson, Sparkles } from "lucide-react";

export default function MetadataHeader() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8">
      <div className="flex items-center gap-5">
        <div className="rounded-2xl bg-blue-600 p-4">
          <FileJson
            size={32}
            className="text-white"
          />
        </div>

        <div>
          <p className="uppercase tracking-widest text-blue-400">
            Shelby Studio
          </p>

          <h1 className="mt-1 text-4xl font-bold text-white">
            Metadata Builder
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Create, validate and publish Shelby NFT metadata
            with live preview and automatic validation.
          </p>
        </div>

        <div className="ml-auto hidden lg:flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm text-yellow-300">
          <Sparkles size={18} />
          AI Ready
        </div>
      </div>
    </div>
  );
}