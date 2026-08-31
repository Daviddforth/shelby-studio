"use client";

import {
  CheckCircle2,
  CloudUpload,
  Database,
  FileJson,
  HardDrive,
  Image,
  Layers3,
  Sparkles,
} from "lucide-react";

import { demoAssets } from "./demoData";

export default function DemoStorageWorkspace() {
  const totalStorage = demoAssets.reduce(
    (total, asset) => total + asset.size,
    0
  );

  return (
    <div className="space-y-6">
      {/* Demo Workspace Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-5 py-4">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
          <Sparkles size={16} className="text-blue-400" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            Demo Storage Workspace
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Explore how Shelby Studio manages stored assets with sample data.
            Connect your wallet to upload and manage your own files.
          </p>
        </div>
      </div>

      {/* Demo Storage Stats */}
      <div className="grid grid-cols-2 border-y border-slate-800 md:grid-cols-4">
        <DemoStat
          icon={Database}
          label="Files"
          value={demoAssets.length.toString()}
        />

        <DemoStat
          icon={HardDrive}
          label="Storage Used"
          value={formatStorage(totalStorage)}
          bordered
        />

        <DemoStat
          icon={CheckCircle2}
          label="Stored"
          value={demoAssets.length.toString()}
          bordered
        />

        <DemoStat
          icon={CloudUpload}
          label="Pending"
          value="0"
          bordered
        />
      </div>

      {/* Demo Upload Area */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div>
          <div className="flex items-center gap-2">
            <CloudUpload
              size={17}
              className="text-blue-400"
            />

            <h2 className="text-base font-semibold text-white">
              Upload to Shelby
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Store assets in Shelby Storage.
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-5 py-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <CloudUpload
              size={20}
              className="text-blue-400"
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white">
            Connect wallet to upload
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            This demo shows the storage interface using sample assets.
            No upload or blockchain operation is performed.
          </p>

          <button
            type="button"
            disabled
            className="mt-5 cursor-not-allowed rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white opacity-50"
          >
            Choose File
          </button>
        </div>
      </section>

      {/* Demo Assets */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-2">
            <Layers3
              size={17}
              className="text-blue-400"
            />

            <h2 className="text-base font-semibold text-white">
              Stored Assets
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Sample files currently stored for the demo workspace.
          </p>
        </div>

        <div className="divide-y divide-slate-800">
          {demoAssets.map((asset) => (
            <div
              key={asset.name}
              className="flex items-center gap-4 px-6 py-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950">
                {asset.type === "application/json" ? (
                  <FileJson
                    size={19}
                    className="text-blue-400"
                  />
                ) : (
                  <Image
                    size={19}
                    className="text-blue-400"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {asset.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {asset.type} · {formatStorage(asset.size)}
                </p>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                <CheckCircle2 size={13} />
                {asset.status}
              </span>
            </div>
          ))}
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

function DemoStat({
  icon: Icon,
  label,
  value,
  bordered = false,
}: {
  icon: typeof Database;
  label: string;
  value: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={`px-4 py-4 ${
        bordered ? "border-l border-slate-800" : ""
      }`}
    >
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={15} />

        <span className="text-[11px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-1.5 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function formatStorage(bytes: number) {
  if (!bytes) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(
    value >= 10 || index === 0 ? 0 : 1
  )} ${units[index]}`;
}
