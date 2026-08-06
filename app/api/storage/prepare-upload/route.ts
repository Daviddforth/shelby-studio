import { NextResponse } from "next/server";

import {
  AccountAddress,
  Network,
} from "@aptos-labs/ts-sdk";

import {
  ShelbyBlobClient,
  ShelbyClient,
  createDefaultErasureCodingProvider,
} from "@shelby-protocol/sdk/node";

export const runtime = "nodejs";

interface PrepareUploadBody {
  fileName: string;
  size: number;
  blobMerkleRoot: string;
  walletAddress: string;
  totalChunksets: number;
}

export async function POST(
  request: Request
) {
  try {
    /*
     * Server-side Shelby API key.
     *
     * There is NO private-key signer here.
     * The connected browser wallet will
     * sign and pay for registration.
     */
    const apiKey =
      process.env.SHELBY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Shelby API key is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Only small metadata JSON reaches
     * this endpoint.
     *
     * File bytes remain browser-direct.
     */
    const body =
      (await request.json()) as
        Partial<PrepareUploadBody>;

    const fileName =
      body.fileName?.trim();

    const size =
      body.size;

    const blobMerkleRoot =
      body.blobMerkleRoot?.trim();

    const walletAddress =
      body.walletAddress?.trim();

    const totalChunksets =
      body.totalChunksets;

    if (!fileName) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A file name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof size !== "number" ||
      !Number.isSafeInteger(size) ||
      size <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A valid file size is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!blobMerkleRoot) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A Shelby blob Merkle root is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A connected wallet address is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof totalChunksets !== "number" ||
      !Number.isSafeInteger(
        totalChunksets
      ) ||
      totalChunksets <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A valid Shelby chunkset count is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate/normalize the connected
     * wallet address.
     */
    let owner:
      AccountAddress;

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
            "The connected wallet address is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Shelbynet configuration.
     */
    const shelbyClient =
      new ShelbyClient({
        network:
          Network.SHELBYNET,

        apiKey,

        locationHint:
          "shelbynet-1",
      });

    /*
     * Keep commitment generation and
     * registration on the same Shelby
     * erasure-coding configuration.
     */
    const provider =
      await createDefaultErasureCodingProvider();

    /*
     * Unique object path.
     */
    const blobName =
      `shelby-studio/${crypto.randomUUID()}/${fileName}`;

    /*
     * Keep object for 30 days.
     */
    const expirationMicros =
      Date.now() * 1000 +
      30 *
        24 *
        60 *
        60 *
        1_000_000;

    /*
     * IMPORTANT:
     *
     * Build ONLY the Move transaction
     * payload.
     *
     * This server does NOT sign it and
     * therefore does NOT pay its gas.
     *
     * The connected wallet will sign and
     * submit this payload in the browser.
     */
    const transactionPayload =
      ShelbyBlobClient
        .createRegisterBlobPayload({
          account:
            owner,

          blobName,

          blobSize:
            size,

          blobMerkleRoot,

          expirationMicros,

          numChunksets:
            totalChunksets,

          locationHint:
            "shelbynet-1",

          /*
           * Shelby erasure encoding.
           *
           * Clay is encoding 0 for the
           * current Shelbynet setup.
           */
          encoding:
            0,

        });

    /*
     * Return public transaction data only.
     *
     * No Shelby Studio private key is
     * involved.
     */
    return NextResponse.json({
      success: true,

      preparation: {
        blobName,

        owner:
          owner.toString(),

        size,

        totalChunksets,

        expirationMicros,

        transactionPayload,
      },
    });
  } catch (error) {
    console.error(
      "Shelby prepare upload failed:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown Shelby prepare-upload error.";

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
