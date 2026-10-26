import { sha256Hex } from "@/lib/media/types";

/**
 * One shape for every wallet-signed action: the wallet signs the action name, a
 * hash of the exact content, and the time. The server rebuilds the same text from
 * the cleaned content, so a signature cannot be reused for anything else.
 * Safe to import from both the browser and the server.
 */

export const ACTION_MAX_AGE_MS = 2 * 60_000;

export async function actionMessage(action: string, fields: string[], issuedAt: string): Promise<string> {
  const hash = await sha256Hex(fields.join("\n"));

  return `Shelby Studio: ${action} | ${hash} | ${issuedAt}`;
}

export interface ActionBody {
  owner: string;
  issuedAt: string;
  publicKey: string;
  signature: string;
  fullMessage: string;
}

export function hasProofFields(body: Record<string, unknown>): boolean {
  return (
    typeof body.owner === "string" &&
    typeof body.issuedAt === "string" &&
    typeof body.publicKey === "string" &&
    typeof body.signature === "string" &&
    typeof body.fullMessage === "string"
  );
}
