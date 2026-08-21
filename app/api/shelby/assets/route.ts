import { NextResponse } from "next/server";

import {
  AccountAddress,
  Network,
} from "@aptos-labs/ts-sdk";

import {
  ShelbyClient,
} from "@shelby-protocol/sdk/node";

export const runtime = "nodejs";

export async function GET(
  request: Request
) {
  try {
    const apiKey =
      process.env.SHELBY_API_KEY;

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

    const url =
      new URL(request.url);

    const walletAddress =
      url.searchParams
        .get("walletAddress")
        ?.trim();

    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A wallet address is required.",
        },
        { status: 400 }
      );
    }

    let owner: AccountAddress;

    try {
      owner =
        AccountAddress.fromString(
          walletAddress
        );
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid wallet address.",
        },
        { status: 400 }
      );
    }

    const shelbyClient =
      new ShelbyClient({
        network:
          Network.SHELBYNET,

        apiKey,

        locationHint:
          "shelbynet-1",
      });

    const blobs =
      await shelbyClient.coordination.getAccountBlobs(
        {
          account: owner,

          pagination: {
            limit: 100,
            offset: 0,
          },
        }
      );

    const assets =
      blobs.map((blob) => ({
        uid:
          blob.uid?.toString() ?? "",

        owner:
          blob.owner.toString(),

        name:
          blob.name.toString(),

        blobName:
          blob.blobNameSuffix,

        size:
          Number(blob.size),

        network:
          "Shelbynet",

        status:
          "Stored" as const,

        uploadedAt:
          blob.creationMicros
            ? new Date(
                Number(
                  blob.creationMicros
                ) / 1000
              ).toISOString()
            : new Date().toISOString(),
      }));

    return NextResponse.json({
      success: true,

      network:
        "Shelbynet",

      account:
        owner.toString(),

      count:
        assets.length,

      assets,
    });
  } catch (error) {
    console.error(
      "Shelby asset sync failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Shelby asset sync error.",
      },
      { status: 500 }
    );
  }
}
