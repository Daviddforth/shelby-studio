export const COLLECTION_TITLE_MAX = 60;
export const COLLECTION_DESC_MAX = 280;
export const COLLECTION_ITEMS_MAX = 100;
export const COLLECTIONS_PER_CREATOR = 30;

export const COLLECTION_ID_RE = /^[0-9a-f]{8}$/;

export interface CollectionData {
  title: string;
  description: string;
  /** Blob names, in play order. */
  items: string[];
}

export interface Collection extends CollectionData {
  id: string;
  owner: string;
  createdAt: string;
}

export function newCollectionId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** What the wallet signs for a save. The server builds the same list from the cleaned content. */
export function collectionFields(id: string, data: CollectionData): string[] {
  return [id, data.title, data.description, ...data.items];
}

export function collectionPath(owner: string, id: string): string {
  return `/c/${owner}/collection/${id}`;
}

/** Same cleaning in the browser and on the server, so what is signed is what is stored. */
export function cleanCollection(input: {
  title?: unknown;
  description?: unknown;
  items?: unknown;
}): { ok: true; data: CollectionData } | { ok: false; error: string } {
  if (typeof input.title !== "string" || typeof input.description !== "string" || !Array.isArray(input.items)) {
    return { ok: false, error: "Missing or invalid fields." };
  }

  const title = input.title.replace(/\s+/g, " ").trim();

  const description = input.description.replace(/\r\n/g, "\n").trim();

  if (!title) return { ok: false, error: "Give the collection a title." };

  if (title.length > COLLECTION_TITLE_MAX) return { ok: false, error: `The title can be up to ${COLLECTION_TITLE_MAX} characters.` };

  if (description.length > COLLECTION_DESC_MAX) {
    return { ok: false, error: `The description can be up to ${COLLECTION_DESC_MAX} characters.` };
  }

  if (/[\u0000-\u0008\u000b-\u001f\u007f]/.test(title + description)) {
    return { ok: false, error: "The text has unsupported characters." };
  }

  const items: string[] = [];

  for (const item of input.items) {
    if (typeof item !== "string" || !item || item.length > 1024) return { ok: false, error: "Invalid file in the list." };

    if (!items.includes(item)) items.push(item);
  }

  if (items.length === 0) return { ok: false, error: "Add at least one file." };

  if (items.length > COLLECTION_ITEMS_MAX) {
    return { ok: false, error: `A collection can hold up to ${COLLECTION_ITEMS_MAX} files.` };
  }

  return { ok: true, data: { title, description, items } };
}
