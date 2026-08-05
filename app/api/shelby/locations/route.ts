import { NextResponse } from "next/server";
import { Network } from "@aptos-labs/ts-sdk";
import { ShelbyClient } from "@shelby-protocol/sdk/node";

export const runtime = "nodejs";

export async function GET() {
  try {
    const apiKey = process.env.SHELBY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "SHELBY_API_KEY is missing." },
        { status: 500 }
      );
    }

    const client = new ShelbyClient({
      network: Network.SHELBYNET,
      apiKey,
    });

    const locations =
      await client.metadata.getLocationNames();

    return NextResponse.json({
      network: "Shelbynet",
      locations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
