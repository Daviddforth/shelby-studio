"use client";

import { useMetadata } from "@/context/MetadataContext";

const templates = [
  {
    name: "PFP Collection",
    description: "Profile-picture collection",
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
    description: "Game asset with traits",
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
    description: "Music and audio assets",
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
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            Templates
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Start with a predefined metadata structure.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.name}
            onClick={() => loadTemplate(template)}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-blue-500/60 hover:bg-slate-900"
          >
            <h3 className="text-sm font-semibold text-white">
              {template.name}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {template.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
