"use client";

import Link from "next/link";

import { Radio } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MediaLibrary from "@/components/media/MediaLibrary";

export default function LibraryPage() {
  return (
    <DashboardLayout>
      <div className="min-w-0 space-y-7">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
            Your content
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Library
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Upload videos, audio and images to Shelby in one place. Every file
            gets a public page and an embed code, and all of it appears on your
            public creator page.
          </p>
        </div>

        <Link
          href="/live"
          className="flex items-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 transition hover:bg-red-500/15"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
            <Radio size={18} />
          </span>

          <span className="min-w-0">
            <span className="block text-sm font-semibold text-white">
              Go live
            </span>

            <span className="block text-xs text-slate-400">
              Stream from your camera or screen and send people a link to watch
              and chat.
            </span>
          </span>
        </Link>

        <MediaLibrary />
      </div>
    </DashboardLayout>
  );
}
