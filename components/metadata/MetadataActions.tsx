"use client";

import {
  CheckCircle2,
  Copy,
  Download,
  RefreshCcw,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";

import { useMetadata } from "@/context/MetadataContext";

type UploadResult = {
  success?: boolean;
  asset?: {
    uid: string;
    name: string;
    blobName: string;
    size: number;
    uploadedAt: string;
    network: string;
    status: string;
    owner: string;
  };
  error?: string;
};

export default function MetadataActions() {
  const { metadata, setMetadata, resetMetadata } = useMetadata();

  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState("");

  const [storedAsset, setStoredAsset] =
    useState<UploadResult["asset"] | null>(null);

  const metadataValid =
    metadata.name.trim() !== "" &&
    metadata.description.trim() !== "" &&
    (metadata.image.trim() !== "" ||
      metadata.imagePreview.trim() !== "");

  function buildJSON() {
    return {
      name: metadata.name.trim(),
      description: metadata.description.trim(),
      collection: metadata.collection.trim(),
      image: metadata.image.trim(),
      animation_url: metadata.animation_url.trim(),
      external_url: metadata.external_url.trim(),
      attributes: metadata.attributes.filter(
        (attribute) =>
          attribute.trait_type.trim() !== "" &&
          attribute.value.trim() !== ""
      ),
    };
  }

  function downloadJSON() {
    const json = buildJSON();

    const blob = new Blob(
      [JSON.stringify(json, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      `${metadata.name || "metadata"}.json`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  async function copyJSON() {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(buildJSON(), null, 2)
      );

      setStatus("idle");
      setMessage("Metadata JSON copied.");
    } catch (error) {
      console.error(
        "Failed to copy metadata JSON:",
        error
      );

      setStatus("error");
      setMessage(
        "Failed to copy metadata JSON."
      );
    }
  }

  async function storeOnShelby() {
    if (!metadataValid) {
      setStatus("error");
      setMessage(
        "Complete the required metadata fields before storing."
      );
      return;
    }

    try {
      setStatus("uploading");
      setStoredAsset(null);
      setMessage(
        "Uploading metadata.json to Shelby..."
      );

      const json = buildJSON();

      const metadataBlob = new Blob(
        [JSON.stringify(json, null, 2)],
        {
          type: "application/json",
        }
      );

      const metadataFile = new File(
        [metadataBlob],
        "metadata.json",
        {
          type: "application/json",
        }
      );

      const formData = new FormData();

      formData.append(
        "file",
        metadataFile
      );

      const response = await fetch(
        "/api/storage/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        (await response.json()) as UploadResult;

      if (
        !response.ok ||
        !result.success ||
        !result.asset
      ) {
        throw new Error(
          result.error ||
            "Shelby metadata upload failed."
        );
      }

      const asset = result.asset;

      setStoredAsset(asset);

      setMetadata((prev) => ({
        ...prev,
        image: prev.image.trim(),
        storage: {
          uid: asset.uid!,
          name: asset.name!,
          blobName: asset.blobName!,
          size: asset.size!,
          uploadedAt: asset.uploadedAt!,
          network: asset.network!,
          owner: asset.owner!,
        },
      }));

      setStatus("success");

      setMessage(
        "metadata.json was successfully stored on Shelby."
      );
    } catch (error) {
      console.error(
        "Metadata upload to Shelby failed:",
        error
      );

      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to store metadata on Shelby."
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div>
        <h2 className="text-base font-semibold text-white">
          Metadata Actions
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Validate, export or store your metadata on Shelby.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={storeOnShelby}
          disabled={status === "uploading"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UploadCloud size={17} />

          {status === "uploading"
            ? "Uploading..."
            : "Store on Shelby"}
        </button>

        <button
          type="button"
          onClick={downloadJSON}
          disabled={status === "uploading"}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={17} />
          Download JSON
        </button>

        <button
          type="button"
          onClick={copyJSON}
          disabled={status === "uploading"}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Copy size={16} />
          Copy JSON
        </button>

        <button
          type="button"
          onClick={resetMetadata}
          disabled={status === "uploading"}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw size={16} />
          Reset Metadata
        </button>
      </div>

      {status === "success" &&
        storedAsset && (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-300">
                  Metadata Stored on Shelby
                </p>

                <p className="mt-1 text-xs text-emerald-400/80">
                  {message}
                </p>

                <div className="mt-3 space-y-1.5 text-xs">
                  <p className="text-slate-400">
                    <span className="text-slate-500">
                      File:
                    </span>{" "}
                    {storedAsset.name}
                  </p>

                  <p className="break-all text-slate-400">
                    <span className="text-slate-500">
                      Blob:
                    </span>{" "}
                    {storedAsset.blobName}
                  </p>

                  <p className="text-slate-400">
                    <span className="text-slate-500">
                      Network:
                    </span>{" "}
                    {storedAsset.network}
                  </p>

                  <p className="text-slate-400">
                    <span className="text-slate-500">
                      Owner:
                    </span>{" "}
                    {storedAsset.owner}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      {status === "error" && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm font-medium text-red-300">
            Metadata storage failed
          </p>

          <p className="mt-1 text-xs leading-5 text-red-400/80">
            {message}
          </p>
        </div>
      )}

      {status === "uploading" && (
        <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <p className="text-sm font-medium text-blue-300">
            Uploading to Shelby
          </p>

          <p className="mt-1 text-xs text-blue-400/80">
            Please wait while Shelby stores your metadata.json file.
          </p>
        </div>
      )}
    </section>
  );
}
