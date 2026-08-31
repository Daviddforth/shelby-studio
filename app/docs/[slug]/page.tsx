import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import MarkdownDocument from "@/components/docs/MarkdownDocument";

const allowedDocs = [
  "introduction",
  "quick-start",
  "philosophy",
  "architecture",
  "storage-engine",
  "upload-pipeline",
  "explorer",
  "metadata",
  "collections",
  "dashboard",
  "engineering-decisions",
  "limitations-roadmap",
"developer",
] as const;

const docTitles: Record<
  (typeof allowedDocs)[number],
  string
> = {
  introduction: "Introduction",
  "quick-start": "Quick Start",
  philosophy: "Philosophy",
  architecture: "Architecture",
  "storage-engine": "Storage Engine",
  "upload-pipeline": "Upload Pipeline",
  explorer: "Explorer",
  metadata: "Metadata",
  collections: "Collections",
  dashboard: "Dashboard",
  "engineering-decisions":
    "Engineering Decisions",
  "limitations-roadmap":
    "Limitations & Roadmap",
developer: "Developer Platform",
};

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return allowedDocs.map((slug) => ({
    slug,
  }));
}

export default async function DocumentationPage({
  params,
}: Props) {
  const { slug } = await params;

  if (
    !allowedDocs.includes(
      slug as (typeof allowedDocs)[number]
    )
  ) {
    notFound();
  }

  const currentSlug =
    slug as (typeof allowedDocs)[number];

  const filePath = path.join(
    process.cwd(),
    "docs",
    `${currentSlug}.md`
  );

  let content: string;

  try {
    content = await fs.readFile(
      filePath,
      "utf8"
    );
  } catch {
    notFound();
  }

  const currentIndex =
    allowedDocs.indexOf(currentSlug);

  const previousSlug =
    currentIndex > 0
      ? allowedDocs[currentIndex - 1]
      : null;

  const nextSlug =
    currentIndex <
    allowedDocs.length - 1
      ? allowedDocs[currentIndex + 1]
      : null;

  return (
    <article className="mx-auto max-w-4xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <Link
          href="/docs"
          className="transition hover:text-blue-400"
        >
          Documentation
        </Link>

        <span>/</span>

        <span className="text-slate-500">
          {docTitles[currentSlug]}
        </span>
      </div>

      <div className="mb-10 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
          <BookOpen size={14} />
          Shelby Studio Docs
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {docTitles[currentSlug]}
        </h1>
      </div>

      <MarkdownDocument
        content={content}
      />

      <div className="mt-14 grid gap-3 border-t border-slate-800 pt-6 sm:grid-cols-2">
        {previousSlug ? (
          <Link
            href={`/docs/${previousSlug}`}
            className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-blue-500/40"
          >
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ArrowLeft size={14} />
              Previous
            </div>

            <p className="mt-2 text-sm font-medium text-slate-300 transition group-hover:text-blue-400">
              {docTitles[previousSlug]}
            </p>
          </Link>
        ) : (
          <div />
        )}

        {nextSlug && (
          <Link
            href={`/docs/${nextSlug}`}
            className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-right transition hover:border-blue-500/40"
          >
            <div className="flex items-center justify-end gap-2 text-xs text-slate-600">
              Next
              <ArrowRight size={14} />
            </div>

            <p className="mt-2 text-sm font-medium text-slate-300 transition group-hover:text-blue-400">
              {docTitles[nextSlug]}
            </p>
          </Link>
        )}
      </div>
    </article>
  );
}
