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
    {
      label: "NFT Name",
      key: "name",
    },
    {
      label: "Collection",
      key: "collection",
    },
    {
      label: "Animation URL",
      key: "animation_url",
    },
    {
      label: "External URL",
      key: "external_url",
    },
  ] as const;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        NFT Information
      </h2>

      <p className="mt-2 text-slate-400">
        Basic information for your Shelby NFT.
      </p>

      <div className="mt-8 space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-2 block text-sm text-slate-400">
              {field.label}
            </label>

            <input
              value={metadata[field.key]}
              onChange={(e) =>
                update(field.key, e.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>
        ))}

        {/* NFT Image Upload */}
        <div>
          <label className="mb-3 block text-sm text-slate-400">
            NFT Image
          </label>

          <ImageUploader />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Description
          </label>

          <textarea
            rows={6}
            value={metadata.description}
            onChange={(e) =>
              update("description", e.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}