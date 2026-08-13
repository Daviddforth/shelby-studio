"use client";

import {
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { useMetadata } from "@/context/MetadataContext";

export default function MetadataValidation() {
  const { metadata } = useMetadata();

  const checks = [
    {
      label: "NFT Name",
      valid: metadata.name.trim() !== "",
    },
    {
      label: "Description",
      valid: metadata.description.trim() !== "",
    },
    {
      label: "Image",
      valid:
        metadata.image.trim() !== "" ||
        Boolean(metadata.imagePreview),
    },
  ];

  const optionalChecks = [
    {
      label: "Collection",
      valid: metadata.collection.trim() !== "",
    },
    {
      label: "Attributes",
      valid: metadata.attributes.length > 0,
    },
  ];

  const completed = checks.filter(
    (check) => check.valid
  ).length;

  const percentage = Math.round(
    (completed / checks.length) * 100
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">
            Metadata Validation
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Required fields are checked as you build.
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            percentage === 100
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-blue-500/10 text-blue-400"
          }`}
        >
          {percentage}%
        </span>
      </div>

      <div className="mt-4 divide-y divide-slate-800">
        {checks.map((check) => (
          <div
            key={check.label}
            className="flex items-center justify-between py-3"
          >
            <span className="text-sm text-slate-300">
              {check.label}
            </span>

            {check.valid ? (
              <CheckCircle2
                size={18}
                className="text-emerald-400"
              />
            ) : (
              <AlertTriangle
                size={18}
                className="text-amber-400"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          Optional
        </p>

        <div className="divide-y divide-slate-800">
          {optionalChecks.map((check) => (
            <div
              key={check.label}
              className="flex items-center justify-between py-2.5"
            >
              <span className="text-sm text-slate-400">
                {check.label}
              </span>

              <span
                className={`text-xs ${
                  check.valid
                    ? "text-emerald-400"
                    : "text-slate-600"
                }`}
              >
                {check.valid ? "Added" : "Optional"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
