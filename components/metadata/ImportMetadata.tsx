"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";
import { useMetadata } from "@/context/MetadataContext";

export default function ImportMetadata() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { setMetadata } = useMetadata();

  async function handleImport(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      setMetadata((prev) => ({
        ...prev,
        name: json.name ?? "",
        description: json.description ?? "",
        collection: json.collection ?? "",
        image: json.image ?? "",
        imagePreview: "",
        animation_url: json.animation_url ?? "",
        external_url: json.external_url ?? "",
        attributes: Array.isArray(json.attributes)
          ? json.attributes
          : [],
      }));

      alert("Metadata imported successfully.");
    } catch (error) {
      console.error(error);
      alert("Invalid metadata.json file.");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        hidden
        onChange={handleImport}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 py-3 text-white transition hover:bg-indigo-700"
      >
        <Upload size={18} />

        Import metadata.json
      </button>
    </div>
  );
}