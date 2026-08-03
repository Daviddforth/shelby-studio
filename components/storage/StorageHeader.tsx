"use client";

import { HardDrive } from "lucide-react";

export default function StorageHeader() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-blue-600 p-4">
          <HardDrive className="h-7 w-7 text-white" />
        </div>

        <div>
          <p className="text-sm uppercase tracking-widest text-blue-400">
            Storage
          </p>

          <h1 className="text-4xl font-bold text-white">
            Shelby Storage
          </h1>

          <p className="mt-2 text-slate-400">
            Store NFT assets, metadata, collections and digital files securely.
          </p>
        </div>
      </div>
    </div>
  );
}