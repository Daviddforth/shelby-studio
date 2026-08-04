"use client";

export default function AssetHistory() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <p className="font-semibold text-white">
          Metadata v3
        </p>

        <p className="text-sm text-green-400">
          Current Version
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <p className="font-semibold text-white">
          Metadata v2
        </p>

        <p className="text-sm text-slate-400">
          Previous Version
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <p className="font-semibold text-white">
          Metadata v1
        </p>

        <p className="text-sm text-slate-400">
          Original Upload
        </p>
      </div>
    </div>
  );
}