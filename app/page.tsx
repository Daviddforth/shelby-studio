"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [metadata, setMetadata] = useState("");

  const generateMetadata = () => {
    const nft = {
      name,
      description,
      image,
      attributes: [],
    };

    setMetadata(JSON.stringify(nft, null, 2));
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(metadata);
    alert("Metadata copied!");
  };

  const downloadJSON = () => {
    const blob = new Blob([metadata], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "metadata.json";

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#070B18] text-white">

      <div className="max-w-7xl mx-auto p-10">

        <h1 className="text-5xl font-bold">
          Shelby NFT Metadata Manager
        </h1>

        <p className="text-gray-400 mt-2">
          Generate, preview and export NFT metadata.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          <div className="bg-[#171E30] rounded-xl p-8">

            <h2 className="text-2xl font-semibold mb-6">
              NFT Details
            </h2>

            <input
              placeholder="NFT Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full p-3 rounded bg-[#252E40] mb-5"
            />

            <textarea
              placeholder="Description"
              rows={4}
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              className="w-full p-3 rounded bg-[#252E40] mb-5"
            />

            <input
              placeholder="Image URL"
              value={image}
              onChange={(e)=>setImage(e.target.value)}
              className="w-full p-3 rounded bg-[#252E40]"
            />

            <button
              onClick={generateMetadata}
              className="mt-6 bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Generate Metadata
            </button>

          </div>

          <div className="bg-[#171E30] rounded-xl p-8">

            <h2 className="text-2xl font-semibold mb-6">
              NFT Preview
            </h2>

            {image ? (
              <img
                src={image}
                className="rounded-xl h-72 w-full object-cover"
                alt="NFT Preview"
              />
            ) : (
              <div className="rounded-xl h-72 bg-[#252E40] flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            <h3 className="text-2xl mt-5 font-bold">
              {name || "NFT Name"}
            </h3>

            <p className="text-gray-400 mt-2">
              {description || "NFT description..."}
            </p>

          </div>

        </div>

        {metadata && (

          <div className="bg-[#171E30] rounded-xl mt-10 p-8">

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold">
                Metadata JSON
              </h2>

              <div className="space-x-3">

                <button
                  onClick={copyJSON}
                  className="bg-green-600 px-5 py-2 rounded"
                >
                  Copy
                </button>

                <button
                  onClick={downloadJSON}
                  className="bg-purple-600 px-5 py-2 rounded"
                >
                  Download
                </button>

              </div>

            </div>

            <pre className="bg-black mt-6 p-5 rounded overflow-auto text-green-400">
              {metadata}
            </pre>

          </div>

        )}

      </div>

    </main>
  );
}