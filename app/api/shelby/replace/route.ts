import { NextResponse } from "next/server";

import {
  Account,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";

import {
  BlobNameSchema,
  createDefaultErasureCodingProvider,
  generateCommitments,
  ShelbyBlobClient,
  ShelbyClient,
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

    const formData = await request.formData();

    const file = formData.get("file");
    const rawBlobName = formData.get("blobName");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Replacement file is required.",
        },
        { status: 400 }
      );
    }

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

    const provider =
      await createDefaultErasureCodingProvider();

    const client =
      new ShelbyClient(
        {
          network: Network.SHELBYNET,
          apiKey,
          locationHint: "shelbynet-1",
        },
        provider
      );

    /*
     * Confirm the existing object exists.
     */
    const existing =
      await client.coordination.getFullObjectMetadata({
        account: signer.accountAddress,
        name: blobName,
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The Shelby object to replace was not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Read replacement file.
     */
    const bytes =
      new Uint8Array(
        await file.arrayBuffer()
      );

    /*
     * Generate commitments.
     */
    const commitments =
      await generateCommitments(
        provider,
        bytes
      );

    /*
     * Preserve current expiration.
     */
    const expirationMicros =
      existing.expirationMicros;

    /*
     * Register new pending blob under
     * the SAME blob name.
     */
    const { transaction } =
      await client.coordination.registerBlob({
        account: signer,

        blobName,

        blobMerkleRoot:
          commitments.blob_merkle_root,

        size: bytes.length,

        expirationMicros,

        options: {
          selectedLocation: "shelbynet-1",
        },
      });

    /*
     * Wait for registration.
     */
    const committedRegistration =
      await client.aptos.waitForTransaction({
        transactionHash:
          transaction.hash,
      });

    /*
     * Aptos returns a union of transaction
     * response types. Make sure this response
     * actually contains events.
     */
    if (
      !("events" in committedRegistration)
    ) {
      throw new Error(
        "Shelby registration transaction returned no events."
      );
    }

    /*
     * Extract new Shelby UID.
     */
    const registered =
      ShelbyBlobClient.registeredBlobUids(
        committedRegistration.events,
        client.coordination.deployer
      );

    if (registered.length === 0) {
      throw new Error(
        "Shelby registration succeeded but no blob UID was found."
      );
    }

    const registeredObject =
      registered.find((entry) =>
        entry.objectName.endsWith(
          `/${blobName}`
        )
      ) ?? registered[0];

    const newUid =
      registeredObject.uid;

    /*
     * Upload replacement bytes.
     */
    const uploadResult =
      await client.rpc.putBlobChunksets({
        account: signer,

        uid: newUid,

        blobData: bytes,

        commitments,

        totalBytes: bytes.length,
      });

    /*
     * Atomically replace the existing
     * object binding.
     */
    const {
      transaction: commitTransaction,
    } =
      await client.coordination.commitObject({
        account: signer,

        uid: newUid,

        blobName,

        overwrite: true,

        storageProviderAcks:
          uploadResult.spAcks,
      });

    /*
     * Wait for replacement commit.
     */
    const committedReplacement =
      await client.aptos.waitForTransaction({
        transactionHash:
          commitTransaction.hash,
      });

    /*
     * Make sure the transaction response
     * contains events.
     */
    if (
      !("events" in committedReplacement)
    ) {
      throw new Error(
        "Shelby replacement transaction returned no events."
      );
    }

    /*
     * Check whether Shelby rejected the
     * overwrite even though the transaction
     * itself succeeded.
     */
    const rejection =
      ShelbyBlobClient.findObjectCommitRejection(
        committedReplacement.events,
        client.coordination.deployer,
        newUid
      );

    if (rejection) {
      throw new Error(
        `Shelby rejected object replacement: ${rejection}`
      );
    }

    /*
     * Independently query the object again
     * after replacement.
     */
    const replaced =
      await client.coordination.getFullObjectMetadata({
        account: signer.accountAddress,
        name: blobName,
      });

    if (!replaced) {
      throw new Error(
        "Replacement committed but Shelby object could not be read back."
      );
    }

    return NextResponse.json({
      success: true,

      replaced: true,

      network: "Shelbynet",

      location: "shelbynet-1",

      previousUid:
        existing.uid?.toString() ?? null,

      asset: {
        uid:
          replaced.uid?.toString() ??
          newUid.toString(),

        owner:
          replaced.owner.toString(),

        name:
          replaced.name.toString(),

        blobName:
          replaced.blobNameSuffix,

        size:
          replaced.size,

        creationMicros:
          replaced.creationMicros,

        expirationMicros:
          replaced.expirationMicros,

        encryption:
          replaced.encryption ?? null,

        sliceAddress:
          replaced.sliceAddress.toString(),
      },
    });
  } catch (error) {
    console.error(
      "Shelby object replacement failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown Shelby replacement error.",
      },
      { status: 500 }
    );
  }
}
