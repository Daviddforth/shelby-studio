import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Disabled on purpose.
 *
 * This route used to sign uploads with the server's own Shelby signer key
 * and accepted any file from anyone, with no login, size limit or rate
 * limit. That let strangers store files at the server's expense. Uploads
 * now go from the browser straight to Shelby and are signed by the user's
 * own wallet (see lib/services/shelbyBrowserDirectUpload.ts).
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Server-signed uploads are disabled. Uploads are signed by your wallet in the browser.",
    },
    { status: 410 }
  );
}
