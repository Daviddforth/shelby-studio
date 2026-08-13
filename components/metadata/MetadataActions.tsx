"use client";

import {
  Download,
  Save,
  RotateCcw,
} from "lucide-react";

import { useMetadata } from "@/context/MetadataContext";

export default function MetadataActions() {
  const {
    metadata,
    resetMetadata,
  } = useMetadata();

  function exportJSON() {
    const blob = new Blob(
      [JSON.stringify(metadata, null, 2)],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "metadata.json";

    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="text-base font-semibold text-white">
        Metadata Actions
      </h2>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-white"
        >
          <Save size={16} />
          Save Draft
        </button>

        <button
          onClick={exportJSON}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Download size={16} />
          Export JSON
        </button>

        <button
          onClick={resetMetadata}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </section>
  );
}
