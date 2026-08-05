"use client";

import { useMetadata } from "@/context/MetadataContext";

const templates = [
  {
    name: "PFP Collection",
    metadata: {
      collection: "PFP Collection",
      attributes: [
        { trait_type: "Background", value: "" },
        { trait_type: "Eyes", value: "" },
        { trait_type: "Mouth", value: "" },
        { trait_type: "Accessory", value: "" },
      ],
    },
  },
  {
    name: "Game Item",
    metadata: {
      collection: "Game Assets",
      attributes: [
        { trait_type: "Rarity", value: "Common" },
        { trait_type: "Level", value: "1" },
        { trait_type: "Attack", value: "0" },
        { trait_type: "Defense", value: "0" },
      ],
    },
  },
  {
    name: "Music NFT",
    metadata: {
      collection: "Music",
      attributes: [
        { trait_type: "Genre", value: "" },
        { trait_type: "Duration", value: "" },
      ],
    },
  },
];

export default function MetadataTemplates() {
  const { setMetadata } = useMetadata();

  function loadTemplate(template: (typeof templates)[number]) {
    setMetadata((prev) => ({
      ...prev,
      collection: template.metadata.collection,
      attributes: template.metadata.attributes,
    }));
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Templates
      </h2>

      <p className="mt-2 text-slate-400">
        Start faster with pre-built metadata templates.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.name}
            onClick={() => loadTemplate(template)}
            className="rounded-2xl border border-slate-700 bg-slate-950 p-6 text-left transition hover:border-blue-500 hover:bg-slate-900"
          >
            <h3 className="font-semibold text-white">
              {template.name}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Load starter metadata.
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}