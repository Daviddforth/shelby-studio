"use client";

import { useCollection } from "@/context/CollectionContext";

export default function CollectionInformation() {
  const {
    collection,
    setCollection,
  } = useCollection();

  function updateText(
    key:
      | "name"
      | "symbol"
      | "creator"
      | "category"
      | "description",
    value: string
  ) {
    setCollection((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateRoyalty(
    value: string
  ) {
    const royalty = Number(value);

    setCollection((prev) => ({
      ...prev,
      royalty: Number.isFinite(royalty)
        ? Math.min(
            100,
            Math.max(0, royalty)
          )
        : 0,
    }));
  }

  function updateVisibility(
    value: "Private" | "Public"
  ) {
    setCollection((prev) => ({
      ...prev,
      visibility: value,
    }));
  }

  const fields = [
    {
      label: "Collection Name",
      key: "name",
      placeholder: "Shelby Genesis",
    },
    {
      label: "Symbol",
      key: "symbol",
      placeholder: "SGEN",
    },
    {
      label: "Creator",
      key: "creator",
      placeholder: "Your name",
    },
    {
      label: "Category",
      key: "category",
      placeholder: "Art, Gaming, Music...",
    },
  ] as const;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Collection Information
      </h2>

      <p className="mt-2 text-slate-400">
        Basic information about your NFT collection.
      </p>

      <div className="mt-8 space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-2 block text-sm text-slate-400">
              {field.label}
            </label>

            <input
              value={collection[field.key]}
              placeholder={field.placeholder}
              onChange={(event) =>
                updateText(
                  field.key,
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>
        ))}

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Description
          </label>

          <textarea
            rows={5}
            value={collection.description}
            onChange={(event) =>
              updateText(
                "description",
                event.target.value
              )
            }
            placeholder="Describe your collection..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Royalty (%)
          </label>

          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={collection.royalty}
            onChange={(event) =>
              updateRoyalty(
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Visibility
          </label>

          <select
            value={collection.visibility}
            onChange={(event) =>
              updateVisibility(
                event.target.value as
                  | "Private"
                  | "Public"
              )
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          >
            <option value="Public">
              Public
            </option>

            <option value="Private">
              Private
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
