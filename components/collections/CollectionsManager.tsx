"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import { ArrowDown, ArrowUp, Check, ExternalLink, ListVideo, Loader2, Plus, Trash2 } from "lucide-react";

import { useWallet } from "@/context/WalletContext";

import { postJson, signAction } from "@/lib/actionsClient";

import {
  COLLECTION_DESC_MAX,
  COLLECTION_TITLE_MAX,
  cleanCollection,
  collectionFields,
  collectionPath,
  newCollectionId,
  type Collection,
} from "@/lib/collections/types";

export interface PickableFile {
  blobName: string;
  title: string;
  kind: string;
}

interface Draft {
  id: string;
  title: string;
  description: string;
  items: string[];
}

/** Create, reorder and delete collections (playlists). Saving needs one free wallet signature. */
export default function CollectionsManager({ files }: { files: PickableFile[] }) {
  const wallet = useWallet();

  const owner = wallet.walletAddress;

  const [collections, setCollections] = useState<Collection[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!owner) return;

    try {
      const data = await (await fetch(`/api/collections?owner=${encodeURIComponent(owner)}`, { cache: "no-store" })).json();

      if (data?.success) setCollections(data.collections);
    } catch {
      // The list is optional.
    }
  }, [owner]);

  useEffect(() => {
    // Loads from the network, then sets state once the answer arrives.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const titles = new Map(files.map((file) => [file.blobName, file.title]));

  const available = files;

  async function save() {
    if (!draft) return;

    setError("");

    const cleaned = cleanCollection(draft);

    if (!cleaned.ok) {
      setError(cleaned.error);
      return;
    }

    setBusy(true);

    try {
      const proof = await signAction(wallet, "save-collection", collectionFields(draft.id, cleaned.data));

      await postJson("/api/collections", { ...proof, id: draft.id, ...cleaned.data });

      setDraft(null);

      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    setError("");

    try {
      const proof = await signAction(wallet, "delete-collection", [id]);

      await postJson("/api/collections", { ...proof, id }, "DELETE");

      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, by: -1 | 1) {
    if (!draft) return;

    const items = [...draft.items];

    const target = index + by;

    if (target < 0 || target >= items.length) return;

    [items[index], items[target]] = [items[target], items[index]];

    setDraft({ ...draft, items });
  }

  function toggle(blobName: string) {
    if (!draft) return;

    setDraft({
      ...draft,
      items: draft.items.includes(blobName) ? draft.items.filter((item) => item !== blobName) : [...draft.items, blobName],
    });
  }

  if (!owner) return null;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <ListVideo size={16} className="text-blue-400" />
            Collections
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Group files into a series, album or playlist with its own link. It plays one after another.
          </p>
        </div>

        {!draft && (
          <button
            type="button"
            onClick={() => setDraft({ id: newCollectionId(), title: "", description: "", items: [] })}
            disabled={files.length === 0}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            <Plus size={14} />
            New
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      {draft ? (
        <div className="mt-4 space-y-3">
          <input
            value={draft.title}
            maxLength={COLLECTION_TITLE_MAX}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="Collection title"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          />

          <textarea
            value={draft.description}
            maxLength={COLLECTION_DESC_MAX}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            placeholder="What is it about? (optional)"
            rows={2}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          />

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-400">Pick files</p>

              <ul className="max-h-60 space-y-1 overflow-y-auto rounded-lg border border-slate-800 p-1.5">
                {available.map((file) => {
                  const picked = draft.items.includes(file.blobName);

                  return (
                    <li key={file.blobName}>
                      <button
                        type="button"
                        onClick={() => toggle(file.blobName)}
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition ${
                          picked ? "bg-blue-500/15 text-white" : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            picked ? "border-blue-400 bg-blue-500" : "border-slate-600"
                          }`}
                        >
                          {picked && <Check size={11} />}
                        </span>

                        <span className="min-w-0 flex-1 truncate">{file.title}</span>

                        <span className="shrink-0 capitalize text-slate-500">{file.kind}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-400">Play order ({draft.items.length})</p>

              <ol className="max-h-60 space-y-1 overflow-y-auto rounded-lg border border-slate-800 p-1.5">
                {draft.items.length === 0 && <li className="px-2 py-3 text-xs text-slate-500">Nothing picked yet.</li>}

                {draft.items.map((blobName, index) => (
                  <li key={blobName} className="flex items-center gap-1.5 rounded-md bg-slate-800/60 px-2 py-1.5 text-xs text-slate-200">
                    <span className="w-5 shrink-0 text-slate-500">{index + 1}</span>

                    <span className="min-w-0 flex-1 truncate">{titles.get(blobName) ?? blobName}</span>

                    <button type="button" aria-label="Move up" onClick={() => move(index, -1)} className="rounded p-1 text-slate-400 hover:text-white">
                      <ArrowUp size={13} />
                    </button>

                    <button type="button" aria-label="Move down" onClick={() => move(index, 1)} className="rounded p-1 text-slate-400 hover:text-white">
                      <ArrowDown size={13} />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void save()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              {busy && <Loader2 size={13} className="animate-spin" />}
              Save collection
            </button>

            <button
              type="button"
              onClick={() => {
                setDraft(null);
                setError("");
              }}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : collections.length === 0 ? (
        <p className="mt-4 text-xs text-slate-500">No collections yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {collections.map((collection) => (
            <li key={collection.id} className="flex items-center gap-3 rounded-lg border border-slate-800 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{collection.title}</p>

                <p className="text-xs text-slate-500">
                  {collection.items.length} {collection.items.length === 1 ? "file" : "files"}
                </p>
              </div>

              <Link
                href={collectionPath(collection.owner, collection.id)}
                className="rounded p-1.5 text-slate-400 hover:text-white"
                aria-label="Open collection"
              >
                <ExternalLink size={15} />
              </Link>

              <button
                type="button"
                onClick={() =>
                  setDraft({
                    id: collection.id,
                    title: collection.title,
                    description: collection.description,
                    items: collection.items,
                  })
                }
                className="rounded px-2 py-1 text-xs text-slate-300 hover:text-white"
              >
                Edit
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => void remove(collection.id)}
                className="rounded p-1.5 text-slate-500 hover:text-red-400 disabled:opacity-50"
                aria-label="Delete collection"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
