"use client";

import { useMetadata } from "@/context/MetadataContext";

export default function JsonPreview() {
  const { metadata } = useMetadata();

  const json = {
    name: metadata.name,
    description: metadata.description,
    collection: metadata.collection,
    image: metadata.image,
    animation_url: metadata.animation_url,
    external_url: metadata.external_url,
    attributes: metadata.attributes.filter(
      (attribute) =>
        attribute.trait_type.trim() !== "" &&
        attribute.value.trim() !== ""
    ),
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Live JSON Preview
          </h2>

          <p className="mt-2 text-slate-400">
            Your metadata updates automatically as you edit.
          </p>
        </div>
      </div>

      <pre className="mt-8 overflow-auto rounded-2xl bg-slate-950 p-6 text-sm text-green-400">
        {JSON.stringify(json, null, 2)}
      </pre>
    </div>
  );
}