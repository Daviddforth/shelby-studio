"use client";

import { useMetadata } from "@/context/MetadataContext";
import ImageUploader from "./ImageUploader";

export default function NFTInformation() {
  const { metadata, setMetadata } = useMetadata();

  function update(
    key: keyof typeof metadata,
    value: string
  ) {
    setMetadata((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const fields = [
    { label: "NFT Name", key: "name" },
    { label: "Collection", key: "collection" },
    { label: "Animation URL", key: "animation_url" },
    { label: "External URL", key: "external_url" },
  ] as const;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div>
        <h2 className="text-base font-semibold text-white">
          NFT Information
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Define the basic information for your asset.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              {field.label}
            </label>

            <input
              value={metadata[field.key]}
              onChange={(e) =>
                update(field.key, e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-xs font-medium text-slate-400">
          NFT Image
        </label>

        <ImageUploader />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Description
        </label>

        <textarea
          rows={4}
          value={metadata.description}
          onChange={(e) =>
            update("description", e.target.value)
          }
          className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
        />
      </div>
    </section>
  );
}
