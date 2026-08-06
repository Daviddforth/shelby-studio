import { NextResponse } from "next/server";

import {
  ShelbyBlobClient,
  type StorageProviderAck,
} from "@shelby-protocol/sdk/node";

export const runtime = "nodejs";

interface SerializedStorageProviderAck {
  slot: number;
  signature: number[];
}

interface FinalizeUploadBody {
  uid: string;
  blobName: string;
  spAcks: SerializedStorageProviderAck[];
}

/*
 * IMPORTANT
 * ---------
 *
 * This endpoint DOES NOT sign or submit
 * the Shelby commit transaction.
 *
 * It only builds the transaction payload.
 *
 * The connected wallet in the browser
 * signs/submits it and therefore pays gas.
 */
export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as
        Partial<FinalizeUploadBody>;

    const uid =
      body.uid?.trim();

    const blobName =
      body.blobName?.trim();

    const spAcks =
      body.spAcks;

    if (!uid) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A valid Shelby blob UID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!blobName) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A valid Shelby blob name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Array.isArray(spAcks) ||
      spAcks.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Shelby storage provider acknowledgements are required.",
        },
        {
          status: 400,
        }
      );
    }

    let blobUid: bigint;

    try {
      blobUid =
        BigInt(uid);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid Shelby blob UID.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Restore the SP acknowledgements
     * produced by Shelby Storage.
     */
    const storageProviderAcks:
      StorageProviderAck[] =
      spAcks.map((ack) => {
        if (
          !Number.isSafeInteger(
            ack.slot
          ) ||
          ack.slot < 0 ||
          !Array.isArray(
            ack.signature
          ) ||
          ack.signature.length === 0
        ) {
          throw new Error(
            "Invalid Shelby storage provider acknowledgement."
          );
        }

        const validSignature =
          ack.signature.every(
            (value) =>
              Number.isInteger(value) &&
              value >= 0 &&
              value <= 255
          );

        if (!validSignature) {
          throw new Error(
            "Invalid Shelby storage provider acknowledgement signature."
          );
        }

        return {
          slot:
            ack.slot,

          signature:
            Uint8Array.from(
              ack.signature
            ),
        };
      });

    /*
     * Build commit_object transaction.
     *
     * Notice:
     *
     * NO Account
     * NO private key
     * NO transaction submission
     *
     * The connected wallet will submit
     * this payload from the browser.
     */
    const transactionPayload =
      ShelbyBlobClient
        .createCommitObjectPayload({
          uid:
            blobUid,

          blobName,

          overwrite:
            true,

          storageProviderAcks,
        });

    return NextResponse.json({
      success: true,

      commit: {
        uid:
          blobUid.toString(),

        blobName,

        transactionPayload,
      },
    });
  } catch (error) {
    console.error(
      "Shelby finalize preparation failed:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown Shelby finalize error.";

    return NextResponse.json(
      {
        success: false,
        error:
          message,
      },
      {
        status: 500,
      }
    );
  }
}
