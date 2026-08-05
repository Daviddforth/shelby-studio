"use client";

import { Download, Save, RotateCcw } from "lucide-react";

import { useMetadata } from "@/context/MetadataContext";

export default function MetadataActions() {
  const {
    metadata,
    resetMetadata,
  } = useMetadata();

  function exportJSON() {
    const blob = new Blob(
      [
        JSON.stringify(
          metadata,
          null,
          2
        ),
      ],
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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Metadata Actions
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <button
          className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-white hover:bg-blue-700"
        >
          <Save size={20} />

          Save Draft
        </button>

        <button
          onClick={exportJSON}
          className="flex items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 text-white hover:bg-green-700"
        >
          <Download size={20} />

          Export JSON
        </button>

        <button
          onClick={resetMetadata}
          className="flex items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 text-white hover:bg-red-700"
        >
          <RotateCcw size={20} />

          Reset
        </button>

      </div>
    </div>
  );
}