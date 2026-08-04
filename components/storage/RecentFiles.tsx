"use client";

import { FileText } from "lucide-react";
import { useStorage } from "@/hooks/useStorage";

export default function RecentFiles() {
  const { assets } = useStorage();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Recent Files
      </h2>

      {assets.length === 0 ? (
        <p className="mt-4 text-slate-400">
          No files uploaded yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {assets.slice(0, 5).map((asset) => (
            <div
              key={asset.uid}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex items-center gap-3">
                <FileText
                  size={22}
                  className="text-blue-400"
                />

                <div>
                  <p className="font-semibold text-white">
                    {asset.name}
                  </p>

                  <p className="text-sm text-slate-400">
                    {(asset.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-green-400">
                  {asset.status}
                </p>

                <p className="text-xs text-slate-500">
                  {asset.network}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}