import { NextResponse } from "next/server";

import {
  Account,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";

import {
  ShelbyClient,
  BlobNameSchema,
} from "@shelby-protocol/sdk/node";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const privateKey =
      process.env.SHELBY_SIGNER_PRIVATE_KEY;

    const apiKey =
      process.env.SHELBY_API_KEY;

    if (!privateKey || !apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Shelby server credentials are missing.",
        },
        { status: 500 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const blobName =
      searchParams.get("blobName");

    if (!blobName) {
      return NextResponse.json(
        {
          success: false,
          error: "blobName is required.",
        },
        { status: 400 }
      );
    }

    const signer =
      Account.fromPrivateKey({
        privateKey:
          new Ed25519PrivateKey(privateKey),
      });

    const client =
      new ShelbyClient({
        network: Network.SHELBYNET,
        apiKey,
        locationHint: "shelbynet-1",
      });

    const parsedBlobName =
      BlobNameSchema.parse(blobName);

    const metadata =
      await client.coordination.getFullObjectMetadata({
        account: signer.accountAddress,
        name: parsedBlobName,
      });

    if (!metadata) {
      return NextResponse.json(
        {
          success: false,
          found: false,
          account:
            signer.accountAddress.toString(),
          blobName,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      found: true,
      network: "Shelbynet",
      location: "shelbynet-1",

      asset: {
        uid:
          metadata.uid?.toString() ?? null,

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

        encryption:
          metadata.encryption ?? null,

        sliceAddress:
          metadata.sliceAddress.toString(),
      },
    });
  } catch (error) {
    console.error(
      "Shelby direct object lookup failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Shelby lookup error.",
      },
      { status: 500 }
    );
  }
}
