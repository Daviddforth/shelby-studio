import { NextResponse } from "next/server";

import {
  Account,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";

import {
  BlobNameSchema,
  ShelbyBlobClient,
} from "@shelby-protocol/sdk/node";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

    const body = await request.json();

    const rawBlobName = body?.blobName;

    if (
      typeof rawBlobName !== "string" ||
      !rawBlobName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "blobName is required.",
        },
        { status: 400 }
      );
    }

    const blobName =
      BlobNameSchema.parse(rawBlobName);

    const signer =
      Account.fromPrivateKey({
        privateKey:
          new Ed25519PrivateKey(privateKey),
      });

    const client =
      new ShelbyBlobClient({
        network: Network.SHELBYNET,
        apiKey,
        locationHint: "shelbynet-1",
      });

    /*
     * Delete the object.
     *
     * ShelbyBlobClient.deleteObject()
     * handles transaction creation/submission
     * and returns the pending transaction.
     */
    const { transaction } =
      await client.deleteObject({
        account: signer,
        blobName,
      });

    /*
     * Wait for the deletion transaction
     * to be finalized on Aptos.
     */
    const result =
      await client.aptos.waitForTransaction({
        transactionHash:
          transaction.hash,
      });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Shelby deletion failed: ${result.vm_status}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      network: "Shelbynet",
      location: "shelbynet-1",
      blobName,
      transaction:
        transaction.hash,
    });
  } catch (error) {
    console.error(
      "Shelby asset deletion failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Shelby deletion error.",
      },
      { status: 500 }
    );
  }
}
