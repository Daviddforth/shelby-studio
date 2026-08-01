"use client";

import { useState } from "react";

type Attribute = {
  trait_type: string;
  value: string;
};

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [traitType, setTraitType] = useState("");
  const [traitValue, setTraitValue] = useState("");

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [metadata, setMetadata] = useState("");

  function addAttribute() {
    if (!traitType.trim() || !traitValue.trim()) return;

    setAttributes([
      ...attributes,
      {
        trait_type: traitType,
        value: traitValue,
      },
    ]);

    setTraitType("");
    setTraitValue("");
  }

  function generateMetadata() {
    const nft = {
      name,
      description,
      image,
      attributes,
    };

    setMetadata(JSON.stringify(nft, null, 2));
  }

  function copyMetadata() {
    navigator.clipboard.writeText(metadata);
    alert("Metadata copied!");
  }

  function downloadMetadata() {
    const blob = new Blob([metadata], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "metadata.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-blue-50">
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-4xl font-bold">
            Shelby NFT Metadata Manager
          </h1>
          <p className="text-blue-100 mt-2">
            Create, preview and export NFT metadata.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 p-8">

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            NFT Details
          </h2>

          <input
            placeholder="NFT Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="NFT Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 p-3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <h3 className="text-xl font-semibold text-blue-700 mb-3">
            NFT Attributes
          </h3>

          <input
            placeholder="Trait Type (Example: Background)"
            value={traitType}
            onChange={(e) => setTraitType(e.target.value)}
            className="w-full border border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            placeholder="Trait Value (Example: Blue)"
            value={traitValue}
            onChange={(e) => setTraitValue(e.target.value)}
            className="w-full border border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={addAttribute}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Add Attribute
          </button>

          {attributes.length > 0 && (
            <div className="mt-6 space-y-2">
              {attributes.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border rounded-lg p-3"
                >
                  <span>{item.trait_type}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={generateMetadata}
            className="mt-8 w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-semibold"
          >
            Generate Metadata
          </button>

        </div>

        <div className="space-y-8">

          <div className="bg-white rounded-xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-blue-700 mb-5">
              NFT Preview
            </h2>

            {image ? (
              <img
                src={image}
                alt="NFT Preview"
                className="w-full h-80 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-80 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                No Image Selected
              </div>
            )}

            <h3 className="text-2xl font-bold mt-6 text-gray-900">
              {name || "NFT Name"}
            </h3>

            <p className="text-gray-600 mt-2">
              {description || "NFT description..."}
            </p>

          </div>

          {metadata && (
            <div className="bg-white rounded-xl shadow-lg p-8">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-2xl font-bold text-blue-700">
                  Metadata JSON
                </h2>

                <div className="space-x-2">

                  <button
                    onClick={copyMetadata}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Copy
                  </button>

                  <button
                    onClick={downloadMetadata}
                    className="bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Download
                  </button>

                </div>

              </div>

              <pre className="bg-slate-900 text-green-400 p-5 rounded-lg overflow-auto text-sm">
                {metadata}
              </pre>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}