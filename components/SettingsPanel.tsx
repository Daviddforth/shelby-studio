"use client";

interface Props {
  collectionSize: number;
  setCollectionSize: (value: number) => void;
}

export default function SettingsPanel({
  collectionSize,
  setCollectionSize,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        ⚙️ Settings
      </h2>

      <div className="mb-6">

        <label className="font-semibold block mb-2">
          Default Collection Size
        </label>

        <select
          value={collectionSize}
          onChange={(e) =>
            setCollectionSize(Number(e.target.value))
          }
          className="w-full border border-blue-200 rounded-lg p-3"
        >
          <option value={10}>10 NFTs</option>
          <option value={25}>25 NFTs</option>
          <option value={50}>50 NFTs</option>
          <option value={100}>100 NFTs</option>
          <option value={500}>500 NFTs</option>
        </select>

      </div>

      <div className="mb-6">

        <label className="font-semibold block mb-2">
          Export Format
        </label>

        <select className="w-full border border-blue-200 rounded-lg p-3">
          <option>JSON</option>
          <option>ZIP (Coming Soon)</option>
        </select>

      </div>

      <hr className="my-6"/>

      <h3 className="font-bold text-blue-700 mb-3">
        🚀 Shelby Roadmap
      </h3>

      <ul className="space-y-2 text-sm">

        <li>✅ Image Upload</li>

        <li>✅ Live Preview</li>

        <li>✅ Metadata Export</li>

        <li>🔄 Batch Collection Generator</li>

        <li>🔄 ZIP Export</li>

        <li>🔄 Shelby Metadata Validation</li>

      </ul>

    </div>
  );
}