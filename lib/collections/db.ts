import "server-only";

import { safeDocs } from "@/lib/store/docs";

import type { Collection, CollectionData } from "./types";

const KIND = "collection";

const toCollection = (doc: { id: string; scope: string; createdAt: string; data: CollectionData }): Collection => ({
  id: doc.id,
  owner: doc.scope,
  createdAt: doc.createdAt,
  ...doc.data,
});

export async function listCollections(owner: string): Promise<Collection[]> {
  return (await safeDocs.list<CollectionData>(KIND, owner, 50)).map(toCollection);
}

export async function getCollection(owner: string, id: string): Promise<Collection | null> {
  const doc = await safeDocs.get<CollectionData>(KIND, owner, id);

  return doc ? toCollection(doc) : null;
}
