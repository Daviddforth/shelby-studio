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
        return <Image size={20} className="text-blue-400" />;

      case "json":
        return <FileJson size={20} className="text-green-400" />;

      case "mp4":
      case "mov":
      case "avi":
        return <Video size={20} className="text-purple-400" />;

      default:
        return <File size={20} className="text-slate-400" />;
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Recent Assets
          </h2>

          <p className="mt-2 text-slate-400">
            Your latest uploaded files.
          </p>
        </div>

        <Link
          href="/explorer"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          View All
          <ArrowRight size={18} />
        </Link>
      </div>

      {assets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
          <p className="text-lg font-semibold text-white">
            No assets uploaded yet
          </p>

          <p className="mt-2 text-slate-400">
            Upload your first file from the Storage page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assets.slice(0, 5).map((asset) => (
            <div
              key={asset.uid}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-5"
            >
              <div className="flex items-center gap-4">
                {getIcon(asset.name)}

                <div>
                  <h3 className="font-semibold text-white">
                    {asset.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {(asset.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-green-700 px-3 py-1 text-sm text-white">
                {asset.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}