import "server-only";

import { AccountAddress, Network } from "@aptos-labs/ts-sdk";

import {
  BlobNameSchema,
  ShelbyClient,
  renderObjectEtag,
} from "@shelby-protocol/sdk/node";

import { getMediaType, type MediaType } from "./types";

export interface ResolvedMedia {
  owner: string;
  blobName: string;
  size: number;
  etag: string;
  committedAtMicros: number;
  media: MediaType;
}

export class MediaLookupError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function createServerShelbyClient(): ShelbyClient {
  const apiKey = process.env.SHELBY_API_KEY;

  if (!apiKey) {
    throw new MediaLookupError("Shelby API key is not configured.", 500);
  }

  return new ShelbyClient({
    network: Network.SHELBYNET,
    apiKey,
    locationHint: "shelbynet-1",
  });
}

/**
 * Resolves a public media request (owner address + blob name) to a stored,
 * hostable object. Throws MediaLookupError with an HTTP status when the
 * request is invalid, unsupported or not found.
 */
export async function resolveMedia(
  ownerInput: string,
  blobNameInput: string,
  client: ShelbyClient = createServerShelbyClient()
): Promise<ResolvedMedia> {
  let owner: AccountAddress;

  try {
    owner = AccountAddress.fromString(ownerInput);
  } catch {
    throw new MediaLookupError("Invalid owner address.", 400);
  }

  let blobName: string;

  try {
    blobName = BlobNameSchema.parse(blobNameInput);
  } catch {
    throw new MediaLookupError("Invalid blob name.", 400);
  }

  const media = getMediaType(blobName);

  if (!media) {
    throw new MediaLookupError("This file type cannot be hosted as media.", 415);
  }

  const object = await client.index.getObject({
    owner,
    key: blobName,
  });

  if (!object) {
    throw new MediaLookupError("Media not found.", 404);
  }

  return {
    owner: owner.toString(),
    blobName,
    size: object.plaintextSize,
    etag: renderObjectEtag(object.etag),
    committedAtMicros: object.committedAtMicros,
    media,
  };
}
