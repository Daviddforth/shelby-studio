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

export async function GET() {
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

    const signer = Account.fromPrivateKey({
      privateKey:
        new Ed25519PrivateKey(privateKey),
    });

    const shelbyClient =
      new ShelbyClient({
        network: Network.SHELBYNET,
        apiKey,
        locationHint: "shelbynet-1",
      });

    const blobs =
      await shelbyClient.coordination.getAccountBlobs({
        account: signer.accountAddress,
        pagination: {
          limit: 100,
          offset: 0,
        },
      });

    const assets = blobs.map((blob) => ({
      uid:
        blob.uid?.toString() ?? null,

      owner:
        blob.owner.toString(),

      name:
        blob.name.toString(),

      blobName:
        blob.blobNameSuffix,

      size:
        blob.size,

      network:
        "Shelbynet",

      location:
        "shelbynet-1",

      creationMicros:
        blob.creationMicros,

      expirationMicros:
        blob.expirationMicros,

      encryption:
        blob.encryption ?? null,
    }));

    return NextResponse.json({
      success: true,

      network: "Shelbynet",

      account:
        signer.accountAddress.toString(),

      count:
        assets.length,

      assets,
    });
  } catch (error) {
    console.error(
      "Shelby Explorer query failed:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown Shelby Explorer error.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
