"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import { Loader2, MessageCircle, Trash2 } from "lucide-react";

import { useWallet } from "@/context/WalletContext";

import { postJson, signAction } from "@/lib/actionsClient";
import { COMMENT_MAX, cleanComment, type Comment } from "@/lib/comments/types";

function ago(iso: string) {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

  return `${Math.floor(seconds / 86400)}d ago`;
}

/** Wallet-signed comments. Reading needs no wallet. */
export default function Comments({ owner, target }: { owner: string; target: string }) {
  const wallet = useWallet();

  const me = wallet.walletAddress?.toLowerCase() ?? null;

  const [comments, setComments] = useState<Comment[] | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const query = `owner=${encodeURIComponent(owner)}&target=${encodeURIComponent(target)}`;

  const load = useCallback(async () => {
    try {
      const data = await (await fetch(`/api/comments?${query}`, { cache: "no-store" })).json();

      setComments(data?.success ? data.comments : []);
    } catch {
      setComments([]);
    }
  }, [query]);

  useEffect(() => {
    // Loads from the network, then sets state once the answer arrives.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function send() {
    setError("");

    const cleaned = cleanComment(text);

    if (!cleaned.ok) {
      setError(cleaned.error);
      return;
    }

    setBusy(true);

    try {
      const proof = await signAction(wallet, "comment", [owner.toLowerCase(), target, cleaned.body]);

      await postJson("/api/comments", { ...proof, creator: owner, target, body: cleaned.body });

      setText("");

      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not post the comment.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setError("");

    try {
      const proof = await signAction(wallet, "delete-comment", [owner.toLowerCase(), target, id]);

      await postJson("/api/comments", { ...proof, creator: owner, target, id }, "DELETE");

      setComments((list) => (list ? list.filter((comment) => comment.id !== id) : list));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the comment.");
    }
  }

  return (
    <section className="mt-10" aria-label="Comments">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
        <MessageCircle size={15} className="text-blue-400" />
        Comments {comments ? `(${comments.length})` : ""}
      </h2>

      {wallet.walletConnected ? (
        <div className="mt-3">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={COMMENT_MAX}
            rows={2}
            placeholder="Add a comment"
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {text.length}/{COMMENT_MAX} · Posting needs one free wallet signature
            </span>

            <button
              type="button"
              onClick={() => void send()}
              disabled={busy || !text.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {busy && <Loader2 size={13} className="animate-spin" />}
              Post
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Connect your wallet to join the conversation.</p>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <ul className="mt-5 space-y-4">
        {comments?.map((comment) => (
          <li key={comment.id} className="text-sm">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href={`/c/${comment.author}`} className="max-w-[60%] truncate font-medium text-slate-300 hover:text-white">
                {comment.authorName}
              </Link>

              <span>{ago(comment.createdAt)}</span>

              {me && (me === comment.author || me === owner.toLowerCase()) && (
                <button
                  type="button"
                  aria-label="Delete comment"
                  onClick={() => void remove(comment.id)}
                  className="ml-auto text-slate-600 transition hover:text-red-400"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            <p className="mt-1 whitespace-pre-wrap break-words leading-6 text-slate-200">{comment.body}</p>
          </li>
        ))}

        {comments && comments.length === 0 && <li className="text-sm text-slate-500">No comments yet. Be the first.</li>}
      </ul>
    </section>
  );
}
