"use client";

import {
  FileImage,
  FileJson,
  FileText,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";

interface FileRowProps {
  name: string;
  type: "image" | "json" | "document";
  size: string;
  uploaded: string;
  status: "Stored" | "Pending";
}

export default function FileRow({
  name,
  type,
  size,
  uploaded,
  status,
}: FileRowProps) {
  const Icon =
    type === "image"
      ? FileImage
      : type === "json"
      ? FileJson
      : FileText;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 transition hover:border-blue-500 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex min-w-0 items-center gap-4">

        <div className="rounded-xl bg-slate-800 p-3">
          <Icon className="text-blue-400" size={24} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-white">
            {name}
          </h3>

          <p className="text-sm text-slate-400">
            {size} • {uploaded}
          </p>
        </div>

      </div>

      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:gap-5">

        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle2 size={18} />
          {status}
        </div>

        <button>
          <MoreHorizontal
            className="text-slate-500 hover:text-white"
            size={22}
          />
        </button>

      </div>

    </div>
  );
}