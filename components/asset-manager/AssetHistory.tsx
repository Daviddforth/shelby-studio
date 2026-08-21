"use client";

import { History } from "lucide-react";

export default function AssetHistory() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
      <History
        size={24}
        className="mx-auto text-slate-600"
      />

      <p className="mt-3 text-sm font-medium text-white">
        No metadata history yet
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        Metadata versions will appear here when you create
        or update metadata.
      </p>
    </div>
  );
}
