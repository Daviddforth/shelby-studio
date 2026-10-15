"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MediaLibrary from "@/components/media/MediaLibrary";

export default function MediaPage() {
  return (
    <DashboardLayout>
      <div className="min-w-0 space-y-7">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
            Creator Media Hosting
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Media
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Host videos, audio and images on Shelby. Every file gets a public
            page and an embed code, and all of it appears on your public
            creator page.
          </p>
        </div>

        <MediaLibrary />
      </div>
    </DashboardLayout>
  );
}
