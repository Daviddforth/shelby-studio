"use client";

import {
  Download,
  Trash2,
  RefreshCw,
  HardDrive,
} from "lucide-react";

import { UploadedAsset } from "@/lib/services/storage";

interface Props {
  asset: UploadedAsset;
}

export default function AssetRow({
  asset,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-600 p-3">
            <HardDrive className="text-white" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {asset.name}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {(asset.size / 1024).toFixed(1)} KB
            </p>

            <p className="text-xs text-slate-500">
              {asset.network}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl bg-slate-800 px-4 py-2 text-white hover:bg-slate-700">
            <Download size={16} className="inline mr-2" />
            Download
          </button>

          <button className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <RefreshCw size={16} className="inline mr-2" />
            Replace
          </button>

          <button className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700">
            <Trash2 size={16} className="inline mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}