import { clientIp, rateLimited } from "@/lib/live/server";
import { DatabaseNotConfiguredError } from "@/lib/media/db";
import { addReport } from "@/lib/reports/db";

import {
  REPORT_DETAILS_MAX,
  REPORT_KINDS,
  REPORT_REASONS,
  isReportablePath,
  type ReportInput,
} from "@/lib/reports/types";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** Public: anyone can report a page. Rate limited, and only pages on this site are accepted. */
export async function POST(request: Request) {
  if (rateLimited(`report:${clientIp(request)}`, 5, 10 * 60_000)) {
    return json({ success: false, error: "Too many reports. Try again in a few minutes." }, 429);
  }

  let body: Partial<ReportInput>;

  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request." }, 400);
  }

  const kind = REPORT_KINDS.find((k) => k === body.kind);

  const reason = REPORT_REASONS.find((r) => r === body.reason);

  if (!kind || !reason || typeof body.target !== "string" || !isReportablePath(kind, body.target)) {
    return json({ success: false, error: "That page cannot be reported." }, 400);
  }

  const details =
    typeof body.details === "string"
      ? body.details.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, REPORT_DETAILS_MAX)
      : "";

  try {
    await addReport({ kind, target: body.target, reason, details });

    return json({ success: true });
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      return json({ success: false, error: error.message }, 503);
    }

    console.error("[report] could not save", error);

    return json({ success: false, error: "Could not send your report. Try again later." }, 500);
  }
}
