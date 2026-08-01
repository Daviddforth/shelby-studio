"use client";

import ImageUploader from "./ImageUploader";
import { Attribute } from "./types";

interface Props {
  name: string;
  setName: (value: string) => void;

  description: string;
  setDescription: (value: string) => void;

  image: string;
  setImage: (value: string) => void;

  traitType: string;
  setTraitType: (value: string) => void;

  traitValue: string;
  setTraitValue: (value: string) => void;

  attributes: Attribute[];
  setAttributes: (value: Attribute[]) => void;

  generateMetadata: () => void;
}

export default function NFTForm({
  name,
  setName,
  description,
  setDescription,
  image,
  setImage,
  traitType,
  setTraitType,
  traitValue,
  setTraitValue,
  attributes,
  setAttributes,
  generateMetadata,
}: Props) {
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        NFT Details
      </h2>

      <input
        placeholder="NFT Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-blue-200 bg-white text-gray-900 p-3 rounded mb-4"
      />

      <textarea
        rows={4}
        placeholder="NFT Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-blue-200 bg-white text-gray-900 p-3 rounded mb-4"
      />

      <ImageUploader onImageUpload={setImage} />

      {image && (
        <p className="mt-3 text-green-600 font-medium">
          ✅ Image uploaded successfully
        </p>
      )}

      <h3 className="text-xl font-bold text-blue-700 mt-8 mb-4">
        NFT Attributes
      </h3>

      <input
        placeholder="Trait Type"
        value={traitType}
        onChange={(e) => setTraitType(e.target.value)}
        className="w-full border border-blue-200 bg-white text-gray-900 p-3 rounded mb-3"
      />

      <input
        placeholder="Trait Value"
        value={traitValue}
        onChange={(e) => setTraitValue(e.target.value)}
        className="w-full border border-blue-200 bg-white text-gray-900 p-3 rounded"
      />

      <button
        onClick={addAttribute}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Add Attribute
      </button>

      {attributes.length > 0 && (
        <div className="mt-6 space-y-2">
          {attributes.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 flex justify-between"
            >
              <span>{item.trait_type}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={generateMetadata}
        className="w-full mt-8 bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl text-lg font-semibold"
      >
        Generate Metadata
      </button>

    </div>
  );
}