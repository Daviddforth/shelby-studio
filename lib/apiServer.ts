import "server-only";

import { actionMessage, ACTION_MAX_AGE_MS, hasProofFields, type ActionBody } from "@/lib/actions";
import { clientIp, normalizeOwner, rateLimited } from "@/lib/live/server";
import { SignatureError, verifyWalletMessage } from "@/lib/media/auth";
import { DatabaseNotConfiguredError } from "@/lib/media/db";

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export const fail = (message: string, status: number) => json({ success: false, error: message }, status);

/**
 * Reads a signed JSON request, rate limits it and checks the wallet signature over
 * `fields` (built by the route from the cleaned content). Returns the verified owner.
 */
export async function readSigned(
  request: Request,
  limitKey: string,
  limit: number,
  action: string,
  buildFields: (body: Record<string, unknown>) => string[] | string
): Promise<{ owner: string; body: Record<string, unknown> } | Response> {
  if (rateLimited(`${limitKey}:${clientIp(request)}`, limit, 60_000)) {
    return fail("Too many requests. Try again in a minute.", 429);
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  const owner = normalizeOwner(body.owner);

  if (!owner || !hasProofFields(body)) return fail("Missing or invalid fields.", 400);

  const fields = buildFields(body);

  if (typeof fields === "string") return fail(fields, 400);

  try {
    await verifyWalletMessage(
      { ...(body as unknown as ActionBody), owner },
      await actionMessage(action, fields, body.issuedAt as string),
      Date.now(),
      ACTION_MAX_AGE_MS
    );
  } catch (error) {
    if (error instanceof SignatureError) return fail(error.message, 401);

    return fail("Could not verify your wallet.", 401);
  }

  return { owner, body };
}

/** Turns an unexpected error into a safe JSON response. */
export function handleError(label: string, error: unknown) {
  if (error instanceof DatabaseNotConfiguredError) return fail(error.message, 503);

  console.error(`[${label}] failed`, error);

  return fail("Something went wrong. Try again.", 500);
}
