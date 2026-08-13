"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMetadata } from "@/context/MetadataContext";

export default function AttributeBuilder() {
  const { metadata, setMetadata } = useMetadata();

  function addAttribute() {
    setMetadata((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        {
          trait_type: "",
          value: "",
        },
      ],
    }));
  }

  function updateAttribute(
    index: number,
    field: "trait_type" | "value",
    value: string
  ) {
    const updated = [...metadata.attributes];

    updated[index][field] = value;

    setMetadata((prev) => ({
      ...prev,
      attributes: updated,
    }));
  }

  function removeAttribute(index: number) {
    setMetadata((prev) => ({
      ...prev,
      attributes: prev.attributes.filter(
        (_, i) => i !== index
      ),
    }));
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            NFT Attributes
            <span className="ml-2 text-xs font-normal text-slate-500">
              Optional
            </span>
          </h2>

          <p className="mt-1 max-w-xl text-xs text-slate-500">
            Add traits such as rarity, background, genre or level.
          </p>
        </div>

        <button
          onClick={addAttribute}
          className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={15} />
          Add Trait
        </button>
      </div>

      {metadata.attributes.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-800 px-5 py-7 text-center">
          <p className="text-sm text-slate-300">
            No attributes added.
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Traits are optional and can be added when useful.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {metadata.attributes.map(
            (attribute, index) => (
              <div
                key={index}
                className="grid gap-2 md:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  value={attribute.trait_type}
                  placeholder="Trait Type"
                  onChange={(e) =>
                    updateAttribute(
                      index,
                      "trait_type",
                      e.target.value
                    )
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                />

                <input
                  value={attribute.value}
                  placeholder="Value"
                  onChange={(e) =>
                    updateAttribute(
                      index,
                      "value",
                      e.target.value
                    )
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                />

                <button
                  onClick={() =>
                    removeAttribute(index)
                  }
                  className="flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 px-3 text-red-400 transition hover:bg-red-500/10"
                  aria-label={`Remove attribute ${index + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}
