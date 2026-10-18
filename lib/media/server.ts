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

export interface OwnerMediaItem {
  blobName: string;
  size: number;
  committedAtMicros: number;
  media: MediaType;
}

/**
 * Lists the hostable media (video, audio, images) stored under one owner
 * address, newest first. Used by the public creator page.
 */
export async function listOwnerMedia(
  ownerInput: string,
  client: ShelbyClient = createServerShelbyClient()
): Promise<{ owner: string; items: OwnerMediaItem[] }> {
  let owner: AccountAddress;

  try {
    owner = AccountAddress.fromString(ownerInput);
  } catch {
    throw new MediaLookupError("Invalid owner address.", 400);
  }

  const objects = await client.index.listObjectsByPrefix({
    owner,
    prefix: "",
    limit: 100,
  });

  const items: OwnerMediaItem[] = [];

  for (const object of objects) {
    const media = getMediaType(object.key);

    if (!media) continue;

    items.push({
      blobName: object.key,
      size: object.plaintextSize,
      committedAtMicros: object.committedAtMicros,
      media,
    });
  }

  items.sort((a, b) => b.committedAtMicros - a.committedAtMicros);

  return { owner: owner.toString(), items };
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

/**
 * Returns the cover's blob name only if it still exists as an image under
 * this owner (a cover can be deleted after it was chosen), otherwise null.
 */
export async function existingCover(
  owner: string,
  coverBlob: string | null | undefined
): Promise<string | null> {
  if (!coverBlob) return null;

  try {
    const cover = await resolveMedia(owner, coverBlob);

    return cover.media.kind === "image" ? cover.blobName : null;
  } catch {
    return null;
  }
}
