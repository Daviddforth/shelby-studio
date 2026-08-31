"use client";

import {
  CheckCircle2,
  FolderKanban,
  Image,
  Layers3,
  Sparkles,
} from "lucide-react";

import { demoCollection } from "./demoData";

export default function DemoCollectionWorkspace() {
  return (
    <div className="space-y-6">
      {/* Demo Workspace Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-5 py-4">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
          <Sparkles size={16} className="text-blue-400" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            Demo Workspace
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Explore the Collection Builder with sample data.
            Connect your wallet to create and manage your own collection.
          </p>
        </div>
      </div>

      {/* Collection Information */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-2">
            <FolderKanban size={17} className="text-blue-400" />

            <h2 className="text-lg font-semibold text-white">
              Collection Information
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Preview how your collection information will appear.
          </p>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <DemoField
            label="Collection Name"
            value={demoCollection.name}
          />

          <DemoField
            label="Symbol"
            value={demoCollection.symbol}
          />

          <DemoField
            label="Creator"
            value={demoCollection.creator}
          />

          <DemoField
            label="Category"
            value={demoCollection.category}
          />

          <div className="sm:col-span-2">
            <DemoField
              label="Description"
              value={demoCollection.description}
            />
          </div>

          <DemoField
            label="Royalty"
            value={`${demoCollection.royalty}%`}
          />

          <DemoField
            label="Visibility"
            value={demoCollection.visibility}
          />
        </div>
      </section>

      {/* Collection Preview */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-2">
          <Image size={17} className="text-blue-400" />

          <div>
            <h2 className="text-base font-semibold text-white">
              Collection Preview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Sample collection preview.
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
          <div className="flex h-32 items-center justify-center border-b border-slate-800 bg-gradient-to-br from-blue-500/10 via-slate-950 to-slate-900">
            <Layers3 size={34} className="text-blue-400/60" />
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {demoCollection.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {demoCollection.symbol}
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                <CheckCircle2 size={13} />
                Metadata Attached
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              {demoCollection.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Creator
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {demoCollection.creator}
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Royalty
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {demoCollection.royalty}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4 text-xs leading-5 text-slate-500">
        This is sample data for presentation only. No wallet,
        transaction, storage upload, or blockchain operation is performed.
      </div>
    </div>
  );
}

function DemoField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-slate-400">
        {label}
      </p>

      <div className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white">
        {value}
      </div>
    </div>
  );
}
