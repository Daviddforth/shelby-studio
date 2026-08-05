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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            NFT Attributes
          </h2>

          <p className="mt-2 text-slate-400">
            Add traits that define your NFT.
          </p>
        </div>

        <button
          onClick={addAttribute}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Trait
        </button>
      </div>

      {metadata.attributes.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-700 p-10 text-center">
          <p className="text-white">
            No attributes added yet.
          </p>

          <p className="mt-2 text-slate-400">
            Click "Add Trait" to begin building your metadata.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {metadata.attributes.map(
            (attribute, index) => (
              <div
                key={index}
                className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
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
                  className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
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
                  className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
                />

                <button
                  onClick={() =>
                    removeAttribute(index)
                  }
                  className="rounded-xl bg-red-600 px-4 text-white hover:bg-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}