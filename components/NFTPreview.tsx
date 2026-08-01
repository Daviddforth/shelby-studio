"use client";

interface Props {
  image: string;
  name: string;
  description: string;
}

export default function NFTPreview({
  image,
  name,
  description,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-blue-700 mb-5">
        NFT Preview
      </h2>

      {image ? (
        <img
          src={image}
          alt="NFT"
          className="w-full h-72 rounded-xl object-cover"
        />
      ) : (
        <div className="w-full h-72 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
          📷 Upload an image
        </div>
      )}

      <h3 className="text-2xl font-bold mt-6 text-gray-900">
        {name || "NFT Name"}
      </h3>

      <p className="text-gray-600 mt-3">
        {description || "NFT description will appear here."}
      </p>

    </div>
  );
}