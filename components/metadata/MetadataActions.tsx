"use client";

import {
  Download,
  Save,
  RotateCcw,
} from "lucide-react";

import { useMetadata } from "@/context/MetadataContext";
import { useWallet } from "@/context/WalletContext";

export default function MetadataActions() {
  const {
    metadata,
    resetMetadata,
  } = useMetadata();

  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  function saveDraft() {
    if (
      !walletConnected ||
      !walletAddress
    ) {
      alert(
        "Connect your wallet before saving a draft."
      );
      return;
    }

    try {
      const storageKey =
        `shelby-metadata:${walletAddress.toLowerCase()}`;

      localStorage.setItem(
        storageKey,
        JSON.stringify(metadata)
      );

      alert(
        "Metadata draft saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save metadata draft:",
        error
      );

      alert(
        "Failed to save metadata draft."
      );
    }
  }

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

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function handleReset() {
    const confirmed =
      window.confirm(
        "Reset all metadata fields? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    resetMetadata();
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="text-base font-semibold text-white">
        Metadata Actions
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        Save your work locally, export it as JSON,
        or reset the workspace.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={saveDraft}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-white"
        >
          <Save size={16} />
          Save Draft
        </button>

        <button
          type="button"
          onClick={exportJSON}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Download size={16} />
          Export JSON
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </section>
  );
}
