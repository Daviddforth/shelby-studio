"use client";

import {
  CalendarDays,
  CheckCircle2,
  FlaskConical,
  Hash,
  Network,
} from "lucide-react";

import type { Project } from "@/context/project/types";

interface PublishedProjectDetailsProps {
  project: Project;
}

export default function PublishedProjectDetails({
  project,
}: PublishedProjectDetailsProps) {
  const record = project.publishRecord;

  if (!project.progress.published) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <CheckCircle2
            size={24}
            className="text-emerald-400"
          />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
            Publication
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Project Published
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            This project has completed the Shelby Studio
            publishing workflow.
          </p>

          {record?.verified && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
              <CheckCircle2
                size={15}
                className="text-emerald-400"
              />

              <span className="text-xs font-medium text-emerald-300">
                Verified on Shelby
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Publication Details */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Detail
          icon={CalendarDays}
          label="Published"
          value={formatPublishedDate(
            project.publishedAt ??
              record?.publishedAt
          )}
        />

        <Detail
          icon={Network}
          label="Network"
          value={record?.network ?? "Shelbynet"}
        />

        <Detail
          icon={FlaskConical}
          label="Mode"
          value={
            record?.mode === "onchain"
              ? "On-chain"
              : "Prototype"
          }
        />

        <Detail
          icon={Hash}
          label="Publication ID"
          value={
            record?.id
              ? shortenId(record.id)
              : "Legacy publication"
          }
        />
      </div>

      {/* Prototype Warning */}
      {record?.mode !== "onchain" && (
        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs leading-5 text-amber-200/80">
            This publication is currently recorded inside
            Shelby Studio only. It does not represent a
            confirmed on-chain transaction.
          </p>
        </div>
      )}

      {/* Shelby Verification */}
      {record?.owner && (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4">
          <div>
            <p className="text-xs text-slate-500">
              Publisher
            </p>

            <p className="mt-1 break-all font-mono text-sm text-slate-300">
              {record.owner}
            </p>
          </div>

          {record.manifestBlob && (
            <div>
              <p className="text-xs text-slate-500">
                Manifest Blob
              </p>

              <p className="mt-1 break-all font-mono text-sm text-slate-300">
                {record.manifestBlob}
              </p>
            </div>
          )}

          {record.registrationTransaction && (
            <div>
              <p className="text-xs text-slate-500">
                Registration Transaction
              </p>

              <p className="mt-1 break-all font-mono text-sm text-slate-300">
                {record.registrationTransaction}
              </p>
            </div>
          )}

          {record.commitTransaction && (
            <div>
              <p className="text-xs text-slate-500">
                Commit Transaction
              </p>

              <p className="mt-1 break-all font-mono text-sm text-slate-300">
                {record.commitTransaction}
              </p>
            </div>
          )}

          {record.verifiedAt && (
            <div>
              <p className="text-xs text-slate-500">
                Verified
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {formatPublishedDate(
                  record.verifiedAt
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Future On-chain Information */}
      {record?.transactionHash && (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">
            Transaction Hash
          </p>

          <p className="mt-2 break-all font-mono text-sm text-slate-300">
            {record.transactionHash}
          </p>
        </div>
      )}
    </section>
  );
}

interface DetailProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function Detail({
  icon: Icon,
  label,
  value,
}: DetailProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={15} />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-medium text-white">
        {value}
      </p>
    </div>
  );
}

function formatPublishedDate(
  dateString?: string | null
) {
  if (!dateString) {
    return "Previously published";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Previously published";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date);
}

function shortenId(id: string) {
  if (id.length <= 16) {
    return id;
  }

  return `${id.slice(0, 8)}...${id.slice(-6)}`;
}