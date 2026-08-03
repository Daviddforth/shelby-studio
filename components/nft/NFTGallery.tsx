"use client";

export default function NFTGallery() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">
        My Shelby NFTs
      </h2>

      <p className="mt-2 text-gray-500">
        NFTs found in your connected wallet.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border p-5">
          <div className="aspect-square rounded-lg bg-gray-100" />

          <h3 className="mt-4 font-semibold">
            Shelby Genesis #1
          </h3>

          <p className="text-sm text-gray-500">
            Placeholder NFT
          </p>
        </div>

      </div>
    </div>
  );
}