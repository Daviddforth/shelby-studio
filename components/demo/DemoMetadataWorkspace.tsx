"use client";

import {
  CheckCircle2,
  FileJson,
  Image,
  Sparkles,
  Tags,
} from "lucide-react";

import { demoMetadata } from "./demoData";

export default function DemoMetadataWorkspace() {
  return (
    <div className="space-y-6">
      {/* Demo Workspace Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-5 py-4">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
          <Sparkles size={16} className="text-blue-400" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            Demo Metadata Workspace
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Explore the Metadata Builder with sample NFT metadata.
            Connect your wallet to create and manage your own metadata.
          </p>
        </div>
      </div>

      {/* Demo Template Area */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div>
          <h2 className="text-base font-semibold text-white">
            Templates
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Start with a predefined metadata structure.
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <DemoTemplate
            name="PFP Collection"
            description="Profile-picture collection"
          />

          <DemoTemplate
            name="Game Item"
            description="Game asset with traits"
          />

          <DemoTemplate
            name="Music NFT"
            description="Music and audio assets"
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        {/* Metadata Information */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-6 py-5">
              <div className="flex items-center gap-2">
                <FileJson
                  size={17}
                  className="text-blue-400"
                />

                <h2 className="text-lg font-semibold text-white">
                  NFT Information
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Sample NFT metadata information.
              </p>
            </div>

            <div className="space-y-5 p-6">
              <DemoField
                label="Name"
                value={demoMetadata.name}
              />

              <DemoField
                label="Collection"
                value={demoMetadata.collection}
              />

              <div>
                <p className="mb-2 text-xs font-medium text-slate-400">
                  Description
                </p>

                <div className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm leading-6 text-white">
                  {demoMetadata.description}
                </div>
              </div>

              <DemoField
                label="Image"
                value={demoMetadata.image}
              />
            </div>
          </section>

          {/* Attributes */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-6 py-5">
              <div className="flex items-center gap-2">
                <Tags
                  size={17}
                  className="text-blue-400"
                />

                <h2 className="text-base font-semibold text-white">
                  Attributes
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Traits attached to this sample NFT.
              </p>
            </div>

            <div className="space-y-3 p-6">
              {demoMetadata.attributes.map((attribute) => (
                <div
                  key={attribute.trait_type}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <DemoField
                    label="Trait"
                    value={attribute.trait_type}
                  />

                  <DemoField
                    label="Value"
                    value={attribute.value}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Preview + JSON */}
        <div className="space-y-6">
          {/* NFT Preview */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-2">
              <Image
                size={17}
                className="text-blue-400"
              />

              <div>
                <h2 className="text-base font-semibold text-white">
                  NFT Preview
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Sample preview of the metadata.
                </p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <div className="flex h-56 items-center justify-center border-b border-slate-800 bg-gradient-to-br from-blue-500/10 via-slate-950 to-slate-900">
                <Image
                  size={42}
                  className="text-blue-400/60"
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {demoMetadata.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {demoMetadata.collection}
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                    <CheckCircle2 size={13} />
                    Valid
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {demoMetadata.description}
                </p>
              </div>
            </div>
          </section>

          {/* JSON Preview */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-6 py-5">
              <div className="flex items-center gap-2">
                <FileJson
                  size={17}
                  className="text-blue-400"
                />

                <h2 className="text-base font-semibold text-white">
                  JSON Preview
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Sample metadata JSON structure.
              </p>
            </div>

            <pre className="overflow-x-auto p-6 text-xs leading-6 text-slate-300">
{JSON.stringify(demoMetadata, null, 2)}
            </pre>
          </section>

          {/* Validation */}
          <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Metadata Valid
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  The sample metadata contains the required fields and
                  is ready for presentation.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

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
        {value || "—"}
      </div>
    </div>
  );
}

function DemoTemplate({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <button
      type="button"
      disabled
      className="cursor-default rounded-xl border border-slate-800 bg-slate-950 p-4 text-left opacity-90"
    >
      <h3 className="text-sm font-semibold text-white">
        {name}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </button>
  );
}
