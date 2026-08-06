import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";

import MarkdownDocument from "@/components/docs/MarkdownDocument";

const allowedDocs = [
  "introduction",
  "philosophy",
  "architecture",
  "storage-engine",
  "upload-pipeline",
  "explorer",
  "metadata",
  "collections",
  "dashboard",
  "engineering-decisions",
] as const;

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

  const filePath = path.join(
    process.cwd(),
    "docs",
    `${slug}.md`
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

  return (
    <article className="mx-auto max-w-4xl px-6 py-14 lg:px-12">
      <MarkdownDocument
        content={content}
      />
    </article>
  );
}
