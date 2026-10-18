import { AccountAddress } from "@aptos-labs/ts-sdk";

import {
  DatabaseNotConfiguredError,
  removeDetails,
} from "@/lib/media/db";

import {
  MediaLookupError,
  createServerShelbyClient,
} from "@/lib/media/server";

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

/**
 * Removes saved details for a file that has been deleted from Shelby.
 *
 * No login is needed because the server first confirms the file is really
 * gone, and removing details for a missing file harms no one. If the file
 * still exists, nothing is removed.
 */
export async function POST(request: Request) {
  let body: { owner?: unknown; blobName?: unknown };

  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request." }, 400);
  }

  if (
    typeof body.owner !== "string" ||
    typeof body.blobName !== "string" ||
    body.blobName.length === 0 ||
    body.blobName.length > 1024
  ) {
    return json({ success: false, error: "owner and blobName are required." }, 400);
  }

  let owner: AccountAddress;

  try {
    owner = AccountAddress.fromString(body.owner);
  } catch {
    return json({ success: false, error: "Invalid owner address." }, 400);
  }

  try {
    const client = createServerShelbyClient();

    const object = await client.index.getObject({
      owner,
      key: body.blobName,
    });

    if (object) {
      return json({ success: true, removed: false });
    }

    await removeDetails(owner.toString(), body.blobName);

    return json({ success: true, removed: true });
  } catch (error) {
    if (error instanceof MediaLookupError) {
      return json({ success: false, error: error.message }, error.status);
    }

    if (error instanceof DatabaseNotConfiguredError) {
      return json({ success: false, error: error.message }, 503);
    }

    console.error("[media-details] Cleanup failed:", error);

    return json({ success: false, error: "Could not clean up right now." }, 502);
  }
}
