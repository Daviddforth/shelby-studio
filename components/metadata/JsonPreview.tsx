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
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div>
        <h2 className="text-base font-semibold text-white">
          Live JSON Preview
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Updates automatically as you edit.
        </p>
      </div>

      <pre className="mt-4 max-h-[360px] overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-5 text-green-400">
        {JSON.stringify(json, null, 2)}
      </pre>
    </section>
  );
}
