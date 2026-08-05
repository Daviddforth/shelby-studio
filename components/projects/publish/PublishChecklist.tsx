"use client";

import {
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

import type { PublishCheck } from "@/lib/publish/types";

interface PublishChecklistProps {
  checks: PublishCheck[];
}

export default function PublishChecklist({
  checks,
}: PublishChecklistProps) {
  return (
    <div className="space-y-3">
      {checks.map((check) => {
        const complete =
          check.status === "complete";

        return (
          <div
            key={check.id}
            className={`rounded-xl border p-4 ${
              complete
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-amber-500/20 bg-amber-500/5"
            }`}
          >
            <div className="flex items-start gap-3">
              {complete ? (
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />
              ) : (
                <CircleAlert
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-400"
                />
              )}

              <div>
                <p
                  className={`text-sm font-medium ${
                    complete
                      ? "text-emerald-300"
                      : "text-amber-300"
                  }`}
                >
                  {check.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {check.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}