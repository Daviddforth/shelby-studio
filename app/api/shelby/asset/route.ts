import { NextResponse } from "next/server";

import {
  Account,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";

import {
  BlobNameSchema,
  ShelbyClient,
} from "@shelby-protocol/sdk/node";

export const runtime = "nodejs";

export async function GET(
  request: Request
) {
  try {
    const privateKey =
      process.env.SHELBY_SIGNER_PRIVATE_KEY;

    const apiKey =
      process.env.SHELBY_API_KEY;

    if (!privateKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Shelby signer is not configured.",
        },
        { status: 500 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Shelby API key is not configured.",
        },
        { status: 500 }
      );
    }

    const url = new URL(request.url);

    const rawBlobName =
      url.searchParams.get("blobName");

    if (!rawBlobName) {
      return NextResponse.json(
        {
          success: false,
          error:
            "blobName query parameter is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate the blob name using the
     * Shelby SDK's own BlobName schema.
     */
    const blobName =
      BlobNameSchema.parse(rawBlobName);

    /*
     * This is currently the managed-storage
     * Shelby account used by Shelby Studio.
     */
    const signer =
      Account.fromPrivateKey({
        privateKey:
          new Ed25519PrivateKey(privateKey),
      });

    const shelbyClient =
      new ShelbyClient({
        network: Network.SHELBYNET,
        apiKey,
        locationHint: "shelbynet-1",
      });

    /*
     * Direct on-chain object lookup.
     *
     * Unlike getAccountBlobs(), this does
     * not depend on listing through the
     * currently incompatible indexer query.
     */
    const metadata =
      await shelbyClient.coordination
        .getFullObjectMetadata({
          account:
            signer.accountAddress,
          name: blobName,
        });

    if (!metadata) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Blob was not found on Shelbynet.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,

      network: "Shelbynet",

      location: "shelbynet-1",

      asset: {
        uid:
          metadata.uid?.toString() ??
          null,

        owner:
          metadata.owner.toString(),

        name:
          metadata.name.toString(),

        blobName:
          metadata.blobNameSuffix,

        size:
          metadata.size,

        creationMicros:
          metadata.creationMicros,

        expirationMicros:
          metadata.expirationMicros,

        sliceAddress:
          metadata.sliceAddress.toString(),

        encryption:
          metadata.encryption ?? null,
      },
    });
  } catch (error) {
    console.error(
      "Shelby asset lookup failed:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown Shelby asset lookup error.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
