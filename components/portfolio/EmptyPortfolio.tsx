import { Images } from "lucide-react";

export default function EmptyPortfolio() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 py-20 text-center">

      <Images
        className="mx-auto text-slate-500"
        size={70}
      />

      <h2 className="mt-6 text-2xl font-semibold text-white">
        No NFTs Found
      </h2>

      <p className="mt-3 text-slate-400">
        Connect your wallet or mint your first Shelby NFT.
      </p>

    </div>
  );
}