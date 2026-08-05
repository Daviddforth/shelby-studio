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
      label: "Collection",
      valid: metadata.collection.trim() !== "",
    },
    {
      label: "Image",
      valid: metadata.image.trim() !== "",
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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Metadata Validation
          </h2>

          <p className="mt-2 text-slate-400">
            Shelby Studio checks your metadata as you build.
          </p>
        </div>

        <span className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white">
          {percentage}% Complete
        </span>
      </div>

      <div className="mt-8 space-y-4">
        {checks.map((check) => (
          <div
            key={check.label}
            className="flex items-center justify-between rounded-2xl bg-slate-950 p-4"
          >
            <span className="text-white">
              {check.label}
            </span>

            {check.valid ? (
              <CheckCircle2 className="text-green-500" />
            ) : (
              <AlertTriangle className="text-yellow-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}