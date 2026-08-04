import DashboardLayout from "@/components/layout/DashboardLayout";
import AssetTabs from "@/components/asset-manager/AssetTabs";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function NFTDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft size={18} />
          Back to Portfolio
        </Link>

        <div>
          <p className="uppercase tracking-widest text-blue-400">
            Shelby Studio
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            NFT #{id}
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Inspect your NFT metadata, blockchain ownership and Shelby Storage
            protection status.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT SIDEBAR */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-slate-800">
                <span className="text-slate-500">
                  NFT Preview
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-400" />

                <h2 className="text-xl font-semibold text-white">
                  Shelby Protection
                </h2>
              </div>

              <div className="mt-5 rounded-xl border border-green-700 bg-green-950/40 p-4">
                <p className="font-semibold text-green-400">
                  Ready for Shelby Storage
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  This NFT can be linked with files stored securely on
                  Shelbynet.
                </p>
              </div>

              <button className="mt-6 w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
                Upload Related Files
              </button>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2">
            <AssetTabs />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}