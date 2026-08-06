import { NextResponse } from "next/server";

import {
  streamUploadToShelby,
} from "@/lib/services/shelbyStreamingUpload";

export const runtime = "nodejs";

/*
 * Large-file Shelby upload endpoint.
 *
 * This route is server-side so Shelby
 * credentials and the signer private key
 * never reach the browser.
 */
export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No valid file provided.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The selected file is empty.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      `[Shelby Streaming] Starting upload: ${file.name} (${file.size} bytes)`
    );

    const asset =
      await streamUploadToShelby({
        file,

        onProgress(progress) {
          console.log(
            `[Shelby Streaming] ${progress.phase}: ${progress.percentage}%`
          );
        },
      });

    console.log(
      `[Shelby Streaming] Upload complete: ${asset.blobName}`
    );

    return NextResponse.json({
      success: true,
      asset,
    });
  } catch (error) {
    console.error(
      "Shelby streaming upload failed:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown Shelby streaming upload error.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
