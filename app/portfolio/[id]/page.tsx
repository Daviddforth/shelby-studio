import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Database,
  Wallet,
  FileJson,
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
            Inspect your NFT metadata, blockchain ownership and Shelby
            Storage protection status.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT */}
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
                  Shelby.
                </p>
              </div>

              <button className="mt-6 w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
                Upload Related Files
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-6 flex items-center gap-3">
                <Wallet className="text-blue-400" />
                <h2 className="text-xl font-semibold text-white">
                  Blockchain Information
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow
                  label="Collection"
                  value="Genesis Collection"
                />

                <InfoRow
                  label="Owner"
                  value="Connected Wallet"
                />

                <InfoRow
                  label="Token Standard"
                  value="Aptos Digital Asset"
                />

                <InfoRow
                  label="Verification"
                  value="Verified"
                />

                <InfoRow
                  label="Storage"
                  value="Shelby Ready"
                />

                <InfoRow
                  label="Network"
                  value="Aptos Testnet"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-6 flex items-center gap-3">
                <Database className="text-purple-400" />

                <h2 className="text-xl font-semibold text-white">
                  NFT Properties
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow label="Background" value="Galaxy" />
                <InfoRow label="Eyes" value="Laser" />
                <InfoRow label="Accessory" value="Crown" />
                <InfoRow label="Rarity" value="Legendary" />
                <InfoRow label="Level" value="10" />
                <InfoRow label="Generation" value="Genesis" />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-6 flex items-center gap-3">
                <FileJson className="text-emerald-400" />

                <h2 className="text-xl font-semibold text-white">
                  Metadata JSON
                </h2>
              </div>

              <pre className="overflow-auto rounded-2xl bg-slate-950 p-5 text-sm text-green-400">
{`{
  "name":"Genesis NFT",
  "description":"Stored securely with Shelby",
  "collection":"Genesis",
  "image":"...",
  "attributes":[
    {
      "trait_type":"Background",
      "value":"Galaxy"
    },
    {
      "trait_type":"Rarity",
      "value":"Legendary"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
      <span className="text-slate-400">
        {label}
      </span>

      <span className="font-semibold text-white">
        {value}
      </span>
    </div>
  );
}