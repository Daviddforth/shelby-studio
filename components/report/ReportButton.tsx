"use client";

import { useState } from "react";

import { Flag, X } from "lucide-react";

import {
  REPORT_DETAILS_MAX,
  REPORT_REASONS,
  type ReportKind,
} from "@/lib/reports/types";

/** "Report" link and small form. Reports go to the site owner; they are not shown publicly. */
export default function ReportButton({
  kind,
  target,
  label = "Report",
  className = "",
}: {
  kind: ReportKind;
  target: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    setState("sending");
    setError("");

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, target, reason, details }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) throw new Error(data.error || "Could not send your report.");

      setState("sent");
    } catch (e) {
      setState("idle");
      setError(e instanceof Error ? e.message : "Could not send your report.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-200 ${className}`}
      >
        <Flag size={12} />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Report this page"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 text-slate-100">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-white">Report this page</h2>

              <button
                type="button"
                aria-label="Close"
                onClick={() => {
                  setOpen(false);
                  setState("idle");
                }}
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {state === "sent" ? (
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Thank you. Your report was sent to the site owner for review.
              </p>
            ) : (
              <form onSubmit={submit} className="mt-4 space-y-3">
                <label className="block text-xs font-medium text-slate-400" htmlFor="report-reason">
                  What is wrong?
                </label>

                <select
                  id="report-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                >
                  {REPORT_REASONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <label className="block text-xs font-medium text-slate-400" htmlFor="report-details">
                  More detail (optional)
                </label>

                <textarea
                  id="report-details"
                  rows={3}
                  value={details}
                  maxLength={REPORT_DETAILS_MAX}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                />

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
                >
                  {state === "sending" ? "Sending…" : "Send report"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
