"use client";

import FileRow from "./FileRow";

export default function RecentFiles() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Recent Files
          </h2>

          <p className="mt-2 text-slate-400">
            Assets stored on Shelbynet.
          </p>

        </div>

      </div>

      <div className="mt-8 space-y-4">

        <FileRow
          name="cover.png"
          type="image"
          size="1.8 MB"
          uploaded="2 min ago"
          status="Stored"
        />

        <FileRow
          name="metadata.json"
          type="json"
          size="3 KB"
          uploaded="5 min ago"
          status="Stored"
        />

        <FileRow
          name="license.pdf"
          type="document"
          size="220 KB"
          uploaded="Yesterday"
          status="Stored"
        />

      </div>

    </div>
  );
}