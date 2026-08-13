"use client";

import { useState } from "react";

import {
  Download,
  RotateCcw,
  Save,
  Rocket,
} from "lucide-react";

import { useCollection } from "@/context/CollectionContext";
import { useStorage } from "@/hooks/useStorage";

export default function CollectionActions() {
  const {
    collection,
    resetCollection,
  } = useCollection();

  const {
    upload,
    loading,
  } = useStorage();

  const [publishMessage, setPublishMessage] =
    useState<string | null>(null);

  const [publishError, setPublishError] =
    useState<string | null>(null);

  function buildCollectionJson() {
    return JSON.stringify(collection, null, 2);
  }

  function exportCollection() {
    const blob = new Blob(
      [buildCollectionJson()],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "collection.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  async function publishToShelby() {
    setPublishMessage(null);
    setPublishError(null);

    try {
      const file = new File(
        [buildCollectionJson()],
        `collection-${Date.now()}.json`,
        { type: "application/json" }
      );

      const asset = await upload(file);

      setPublishMessage(
        `Published to Shelby: ${asset.name}`
      );
    } catch (error) {
      console.error(
        "Collection publish failed:",
        error
      );

      setPublishError(
        error instanceof Error
          ? error.message
          : "Failed to publish collection to Shelby."
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-6 py-5">
        <h2 className="text-lg font-semibold text-white">
          Collection Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Save, export or publish your collection.
        </p>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-2">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:text-white"
        >
          <Save size={17} />
          Save Draft
        </button>

        <button
          type="button"
          onClick={exportCollection}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:text-white"
        >
          <Download size={17} />
          Export JSON
        </button>

        <button
          type="button"
          onClick={publishToShelby}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Rocket size={17} />

          {loading
            ? "Publishing..."
            : "Publish to Shelby"}
        </button>

        <button
          type="button"
          onClick={resetCollection}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
        >
          <RotateCcw size={17} />
          Reset
        </button>
      </div>

      {publishMessage && (
        <div className="mx-6 mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
          {publishMessage}
        </div>
      )}

      {publishError && (
        <div className="mx-6 mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {publishError}
        </div>
      )}
    </section>
  );
}
