"use client";

import NFTCard from "./NFTCard";
import { usePortfolio } from "@/hooks/usePortfolio";

export default function NFTGrid() {
  const {
    nfts,
    loading,
    connected,
  } = usePortfolio();

  if (!connected) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
        <h2 className="text-2xl font-bold text-white">
          Connect your wallet
        </h2>

        <p className="mt-3 text-slate-400">
          Connect an Aptos wallet to view your NFTs.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        Loading portfolio...
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
        <h2 className="text-2xl font-bold text-white">
          No NFTs Found
        </h2>

        <p className="mt-3 text-slate-400">
          No NFTs were found for this wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.id}
          name={nft.name}
          collection={nft.collection}
          image={nft.image}
        />
      ))}
    </div>
  );
}