import { getShelbyBlobExpirationMicros } from "@/lib/shelby/config";

import { NextResponse } from "next/server";

import {
  Account,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";

import {
  ShelbyClient,
} from "@shelby-protocol/sdk/node";

export const runtime = "nodejs";

export async function POST(
  request: Request
) {
  try {
    /*
     * Server-only credentials.
     *
     * Never expose the signer private key
     * through NEXT_PUBLIC_* variables.
     */
    const privateKey =
      process.env.SHELBY_SIGNER_PRIVATE_KEY;

    const apiKey =
      process.env.SHELBY_API_KEY;

    if (!privateKey) {
      return NextResponse.json(
        {
          error:
            "Shelby signer is not configured.",
        },
        { status: 500 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Shelby API key is not configured.",
        },
        { status: 500 }
      );
    }

    /*
     * Recreate the persistent server signer
     * from the private key stored in .env.local.
     */
    const signer = Account.fromPrivateKey({
      privateKey:
        new Ed25519PrivateKey(privateKey),
    });

    /*
     * Real Shelby client targeting Shelbynet.
     */
    const shelbyClient =
      new ShelbyClient({
        network: Network.SHELBYNET,
        apiKey,
        locationHint: "shelbynet-1",
      });

    /*
     * Receive the file sent by Shelby Studio.
     */
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No valid file provided.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: "The selected file is empty.",
        },
        { status: 400 }
      );
    }

    /*
     * Convert the uploaded browser file
     * into the Uint8Array required by Shelby.
     */
    const blobData =
      new Uint8Array(
        await file.arrayBuffer()
      );

    /*
     * Use the centralized Shelbynet retention policy.
     */
    const expirationMicros =
      getShelbyBlobExpirationMicros();

    /*
     * Give every upload a unique Shelby
     * blob path so duplicate filenames
     * cannot collide.
     */
    const blobName =
      `shelby-studio/${crypto.randomUUID()}/${file.name}`;

    /*
     * REAL SHELBY UPLOAD.
     *
     * This performs commitment generation,
     * blockchain registration and storage
     * upload through the Shelby SDK.
     *
     * If Shelby fails, execution jumps
     * directly to the catch block.
     */
    await shelbyClient.upload({
      blobData,
      signer,
      blobName,
      expirationMicros,
    });

    /*
     * We only return Stored AFTER Shelby's
     * upload method successfully completes.
     */
    return NextResponse.json({
      success: true,

      asset: {
        uid: crypto.randomUUID(),
        name: file.name,
        blobName,
        size: file.size,
        uploadedAt:
          new Date().toISOString(),
        network: "Shelbynet",
        status: "Stored",
        owner:
          signer.accountAddress.toString(),
      },
    });
  } catch (error) {
    console.error(
      "Real Shelby upload failed:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown Shelby upload error.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
