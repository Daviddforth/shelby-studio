import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Disabled on purpose.
 *
 * This route performed server-signed deletes with the server's own Shelby signer key and
 * had no login, so anyone could call it. The app no longer uses it: uploads
 * and deletes are signed by the user's own wallet in the browser.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        "This server-signed endpoint is disabled. Uploads and deletes are signed by your wallet.",
    },
    { status: 410 }
  );
}
