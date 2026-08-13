"use client";

import Link from "next/link";
import {
  File,
  Image,
  FileJson,
  Video,
  ArrowRight,
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
        <div className="mt-5 rounded-xl border border-dashed border-slate-800 px-5 py-8 text-center">
          <p className="text-sm font-medium text-white">
            No assets uploaded yet
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Upload your first file from Storage.
          </p>
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
