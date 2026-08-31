"use client";

import Link from "next/link";
import {
  File,
  Image,
  FileJson,
  Video,
  ArrowRight,
  Upload,
} from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";

export default function RecentAssets() {
  const { assets } = useStorageContext();

  function getIcon(name: string) {
    const extension = name.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
        return <Image size={17} className="text-blue-400" />;

      case "json":
        return <FileJson size={17} className="text-green-400" />;

      case "mp4":
      case "mov":
      case "avi":
        return <Video size={17} className="text-purple-400" />;

      default:
        return <File size={17} className="text-slate-400" />;
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            Recent Assets
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Latest uploaded files
          </p>
        </div>

        <Link
          href="/explorer"
          className="flex items-center gap-1 text-xs font-medium text-blue-400 transition hover:text-blue-300"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      {assets.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-5 py-9 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Upload size={18} />
          </div>

          <p className="mt-4 text-sm font-medium text-white">
            Your storage is ready
          </p>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
            Files you upload to Shelby will appear here,
            along with their storage status.
          </p>

          <Link
            href="/storage"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-400"
          >
            Upload an asset
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-slate-800">
          {assets.slice(0, 5).map((asset) => (
            <div
              key={asset.uid}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                  {getIcon(asset.name)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {asset.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(asset.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-xs text-emerald-400">
                {asset.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
