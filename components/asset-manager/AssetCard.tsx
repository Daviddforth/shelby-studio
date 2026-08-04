"use client";

import {
  FileText,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

interface Props {
  uid: string;
  name: string;
  size: string;
  network: string;
  uploadedAt: string;
  status: string;
}

export default function AssetCard({
  uid,
  name,
  size,
  network,
  uploadedAt,
  status,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <FileText
            size={28}
            className="text-blue-400"
          />

          <div>
            <h3 className="font-semibold text-white">
              {name}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {size}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              UID: {uid}
            </p>

            <p className="text-xs text-slate-500">
              Network: {network}
            </p>

            <p className="text-xs text-slate-500">
              Uploaded:{" "}
              {new Date(uploadedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle2 size={18} />
          {status}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700">
          <Download size={16} />
          Download
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700">
          <RefreshCw size={16} />
          Replace
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700">
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}