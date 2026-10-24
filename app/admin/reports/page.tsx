"use client";

import { useState } from "react";

import Link from "next/link";

import DashboardLayout from "@/components/layout/DashboardLayout";

import { useWallet } from "@/context/WalletContext";

import { signWalletMessage } from "@/lib/media/clientSign";
import { buildAdminMessage, type ReportRecord } from "@/lib/reports/types";

export default function AdminReportsPage() {
  const { walletConnected, walletAddress, account, signMessage } = useWallet();

  const [reports, setReports] = useState<ReportRecord[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(markReviewed?: string) {
    if (!walletAddress) return;

    setLoading(true);
    setError("");

    try {
      const issuedAt = new Date().toISOString();

      const proof = await signWalletMessage({
        signMessage,
        account,
        message: buildAdminMessage(issuedAt),
      });

      const response = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: walletAddress, issuedAt, ...proof, markReviewed }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.error || "Could not load reports.");

      setReports(data.reports);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load reports.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="min-w-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Only the wallet set as ADMIN_WALLET_ADDRESS can open this list. You sign a free message each time.
          </p>
        </div>

        {!walletConnected ? (
          <p className="text-sm text-slate-500">Connect your wallet first.</p>
        ) : (
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Loading…" : reports ? "Refresh" : "Load reports"}
          </button>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        {reports && reports.length === 0 && <p className="text-sm text-slate-500">No reports yet.</p>}

        <div className="space-y-3">
          {reports?.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                    report.status === "open" ? "bg-red-600 text-white" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {report.status}
                </span>

                <span className="font-semibold text-white">{report.reason}</span>

                <span className="text-xs text-slate-500">
                  {report.kind} · {new Date(report.createdAt).toLocaleString()}
                </span>
              </div>

              <Link href={report.target} target="_blank" className="mt-2 block break-all text-blue-400 hover:underline">
                {report.target}
              </Link>

              {report.details && <p className="mt-2 whitespace-pre-line text-slate-300">{report.details}</p>}

              {report.status === "open" && (
                <button
                  type="button"
                  onClick={() => void load(report.id)}
                  className="mt-3 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                >
                  Mark reviewed
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
