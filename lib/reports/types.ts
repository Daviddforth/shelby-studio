/** Reports from the public (safe for server and client code). */

export const REPORT_KINDS = ["media", "creator", "live"] as const;

export type ReportKind = (typeof REPORT_KINDS)[number];

export const REPORT_REASONS = [
  "Illegal content",
  "Copyright / piracy",
  "Sexual or violent content",
  "Harassment or hate",
  "Scam or impersonation",
  "Something else",
] as const;

export const REPORT_DETAILS_MAX = 500;

export const REPORT_TARGET_MAX = 300;

export interface ReportInput {
  kind: ReportKind;
  /** What is being reported: a page path such as /m/<owner>/<file>, /c/<owner> or /live/<code>. */
  target: string;
  reason: (typeof REPORT_REASONS)[number];
  details: string;
}

export interface ReportRecord extends ReportInput {
  id: string;
  createdAt: string;
  status: "open" | "reviewed";
}

/** Only paths on this site can be reported. */
export function isReportablePath(kind: ReportKind, target: string): boolean {
  if (target.length > REPORT_TARGET_MAX) return false;

  if (kind === "media") return /^\/m\/0x[0-9a-fA-F]{1,64}\/[^\s?#]+$/.test(target);

  if (kind === "creator") return /^\/c\/0x[0-9a-fA-F]{1,64}$/.test(target);

  return /^\/live\/[a-f0-9]{20}$/.test(target);
}

/** The text an admin's wallet signs to read the reports. */
export function buildAdminMessage(issuedAt: string): string {
  return `Shelby Studio: review reports | ${issuedAt}`;
}
