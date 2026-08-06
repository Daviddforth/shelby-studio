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
    return JSON.stringify(
      collection,
      null,
      2
    );
  }

  function exportCollection() {
    const blob = new Blob(
      [buildCollectionJson()],
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

  async function publishToShelby() {
    setPublishMessage(null);
    setPublishError(null);

    try {
      /*
       * Convert the current collection
       * metadata into a JSON file.
       *
       * This allows the collection to use
       * the exact same Shelby upload system
       * already used by Storage.
       */
      const collectionJson =
        buildCollectionJson();

      const file = new File(
        [collectionJson],
        `collection-${Date.now()}.json`,
        {
          type: "application/json",
        }
      );

      /*
       * Upload through Shelby Studio's
       * existing browser-direct pipeline.
       *
       * The existing upload() function
       * handles:
       *
       * - connected wallet
       * - Shelby registration
       * - transaction signing
       * - API authentication
       * - storage provider upload
       * - final Shelby commit
       * - adding the result to Storage
       */
      const asset =
        await upload(file);

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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Collection Actions
      </h2>

      <p className="mt-2 text-slate-400">
        Save, export or publish your NFT collection.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* SAVE DRAFT */}
        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 text-white hover:bg-blue-700"
        >
          <Save size={20} />
          Save Draft
        </button>

        {/* EXPORT JSON */}
        <button
          type="button"
          onClick={exportCollection}
          className="flex items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 text-white hover:bg-green-700"
        >
          <Download size={20} />
          Export JSON
        </button>

        {/* PUBLISH TO SHELBY */}
        <button
          type="button"
          onClick={publishToShelby}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-2xl bg-purple-600 py-4 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Rocket size={20} />

          {loading
            ? "Publishing..."
            : "Publish to Shelby"}
        </button>

        {/* RESET */}
        <button
          type="button"
          onClick={resetCollection}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {publishMessage && (
        <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {publishMessage}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {publishError && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {publishError}
        </div>
      )}
    </div>
  );
}