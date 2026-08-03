"use client";

import NFTGrid from "./NFTGrid";

export default function PortfolioGrid() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Shelby NFTs
        </h2>

        <p className="mt-2 text-slate-400">
          NFTs detected from your connected wallet.
        </p>
      </div>

      <NFTGrid />
    </div>
  );
}