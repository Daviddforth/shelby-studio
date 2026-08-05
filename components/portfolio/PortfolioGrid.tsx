"use client";

import { useMetadata } from "@/context/MetadataContext";
import PortfolioCard from "./PortfolioCard";

export default function PortfolioGrid() {
  const { metadata } = useMetadata();

  if (!metadata.name) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-16 text-center">
        <h2 className="text-2xl font-bold text-white">
          No NFTs Yet
        </h2>

        <p className="mt-3 text-slate-400">
          Create metadata first and your NFTs will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <PortfolioCard
        title={metadata.name}
        description={metadata.description}
        image={metadata.imagePreview}
        collection={metadata.collection}
      />
    </div>
  );
}