import { NextResponse } from "next/server";

import {
  Network,
} from "@aptos-labs/ts-sdk";

import {
  ShelbyClient,
} from "@shelby-protocol/sdk/node";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const apiKey =
      process.env.SHELBY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Shelby API key is missing.",
        },
        { status: 500 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const blobName =
      searchParams.get("blobName");

    const owner =
      searchParams.get("owner");

    if (!blobName || !owner) {
      return NextResponse.json(
        {
          success: false,
          error:
            "blobName and owner are required.",
        },
        { status: 400 }
      );
    }

    const client =
      new ShelbyClient({
        network: Network.SHELBYNET,
        apiKey,
        locationHint: "shelbynet-1",
      });

    const blob =
      await client.download({
        account: owner,
        blobName,
      });

    const chunks: Uint8Array[] = [];

    const reader =
      blob.readable.getReader();

    while (true) {
      const {
        done,
        value,
      } = await reader.read();

      if (done) break;

      chunks.push(value);
    }

    const totalLength =
      chunks.reduce(
        (total, chunk) =>
          total + chunk.length,
        0
      );

    const bytes =
      new Uint8Array(totalLength);

    let offset = 0;

    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }

    const filename =
      blobName.split("/").pop() ||
      "shelby-download";

    return new Response(bytes, {
      status: 200,

      headers: {
        "Content-Type":
          "application/octet-stream",

        "Content-Disposition":
          `attachment; filename="${filename.replace(
            /"/g,
            ""
          )}"`,

        "Content-Length":
          bytes.length.toString(),

        "X-Shelby-Network":
          "Shelbynet",
      },
    });
  } catch (error) {
    console.error(
      "Shelby download failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown Shelby download error.",
      },
      { status: 500 }
    );
  }
}
