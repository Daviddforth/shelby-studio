import { AccountAddress } from "@aptos-labs/ts-sdk";

import { SignatureError, verifySaveRequest } from "@/lib/media/auth";

import {
  DatabaseNotConfiguredError,
  getDetailsForOwner,
  saveDetails,
} from "@/lib/media/db";

import {
  MediaLookupError,
  createServerShelbyClient,
  resolveMedia,
} from "@/lib/media/server";

import {
  DESCRIPTION_MAX,
  TITLE_MAX,
  type SaveDetailsRequest,
} from "@/lib/media/types";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function fail(message: string, status: number) {
  return json({ success: false, error: message }, status);
}

/** Public: titles, descriptions and covers for one creator's files. */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("owner");

  if (!raw) return fail("owner is required.", 400);

  let owner: string;

  try {
    owner = AccountAddress.fromString(raw).toString();
  } catch {
    return fail("Invalid owner address.", 400);
  }

  return json({ success: true, owner, details: await getDetailsForOwner(owner) });
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length <= max ? trimmed : null;
}

/** Owner-only: save details. The request must carry a valid wallet signature. */
export async function PUT(request: Request) {
  let body: Partial<SaveDetailsRequest>;

  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  const title = text(body.title ?? "", TITLE_MAX);
  const description = text(body.description ?? "", DESCRIPTION_MAX);

  if (title === null) {
    return fail(`Title must be ${TITLE_MAX} characters or fewer.`, 400);
  }

  if (description === null) {
    return fail(
      `Description must be ${DESCRIPTION_MAX} characters or fewer.`,
      400
    );
  }

  if (
    typeof body.owner !== "string" ||
    typeof body.blobName !== "string" ||
    typeof body.issuedAt !== "string" ||
    typeof body.publicKey !== "string" ||
    typeof body.signature !== "string" ||
    typeof body.fullMessage !== "string" ||
    !(body.coverBlob === null || typeof body.coverBlob === "string")
  ) {
    return fail("Missing or invalid fields.", 400);
  }

  let owner: string;

  try {
    owner = AccountAddress.fromString(body.owner).toString();
  } catch {
    return fail("Invalid owner address.", 400);
  }

  const signed: SaveDetailsRequest = {
    owner: body.owner,
    blobName: body.blobName,
    title: body.title ?? "",
    description: body.description ?? "",
    coverBlob: body.coverBlob,
    issuedAt: body.issuedAt,
    publicKey: body.publicKey,
    signature: body.signature,
    fullMessage: body.fullMessage,
  };

  try {
    // 1. Only the wallet that owns the file may change its details.
    await verifySaveRequest(signed);

    // 2. The file must really exist on Shelby under this owner.
    const client = createServerShelbyClient();

    const media = await resolveMedia(owner, body.blobName, client);

    // 3. A cover must be an image that exists under the same owner.
    let coverBlob: string | null = null;

    if (body.coverBlob) {
      const cover = await resolveMedia(owner, body.coverBlob, client);

      if (cover.media.kind !== "image") {
        return fail("The cover must be an image.", 400);
      }

      coverBlob = cover.blobName;
    }

    await saveDetails(owner, media.blobName, {
      title,
      description,
      coverBlob,
    });

    return json({
      success: true,
      details: { title, description, coverBlob },
    });
  } catch (error) {
    if (error instanceof SignatureError) return fail(error.message, 401);

    if (error instanceof MediaLookupError) return fail(error.message, error.status);

    if (error instanceof DatabaseNotConfiguredError) {
      return fail(error.message, 503);
    }

    console.error("[media-details] Save failed:", error);

    return fail("Could not save details right now.", 500);
  }
}
