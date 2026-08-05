"use client";

import {
  Download,
  RotateCcw,
  Save,
  Rocket,
} from "lucide-react";

import { useCollection } from "@/context/CollectionContext";

export default function CollectionActions() {
  const {
    collection,
    resetCollection,
  } = useCollection();

  function exportCollection() {
    const blob = new Blob(
      [
        JSON.stringify(
          collection,
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
    link.download = "collection.json";

    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Collection Actions
      </h2>

      <p className="mt-2 text-slate-400">
        Save, export or publish your NFT collection.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <button
          className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-white hover:bg-blue-700"
        >
          <Save size={20} />
          Save Draft
        </button>

        <button
          onClick={exportCollection}
          className="flex items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 text-white hover:bg-green-700"
        >
          <Download size={20} />
          Export JSON
        </button>

        <button
          className="flex items-center justify-center gap-3 rounded-2xl bg-purple-600 py-4 text-white hover:bg-purple-700"
        >
          <Rocket size={20} />
          Publish to Shelby
        </button>

        <button
          onClick={resetCollection}
          className="flex items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 text-white hover:bg-red-700"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
    </div>
  );
}