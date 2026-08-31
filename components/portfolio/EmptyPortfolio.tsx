import Link from "next/link";
import { Images, ArrowRight } from "lucide-react";

export default function EmptyPortfolio() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
        <Images size={28} />
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-white">
        Your portfolio is empty
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        NFTs associated with your connected wallet will appear here.
        Mint or acquire a Shelby NFT to start building your portfolio.
      </p>

      <Link
        href="/explorer"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
      >
        Explore assets
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
