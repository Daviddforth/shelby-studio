import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { Account } from "@aptos-labs/ts-sdk";

import { actionMessage } from "@/lib/actions";
import { readSigned } from "@/lib/apiServer";
import { cleanCollection, collectionFields } from "@/lib/collections/types";

import { fakeWallet } from "./helpers";

// The development file store writes under the current folder, so use a throwaway one.
delete process.env.DATABASE_URL;

process.chdir(mkdtempSync(path.join(tmpdir(), "shelby-docs-")));

async function signedRequest(account: Account, action: string, fields: string[], extra: Record<string, unknown> = {}, ip = "9.9.9.9") {
  const issuedAt = new Date().toISOString();

  const message = await actionMessage(action, fields, issuedAt);

  const nonce = "abc123";

  const signed = await fakeWallet(account)({ message, nonce });

  return new Request("http://localhost/api/x", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: JSON.stringify({
      owner: account.accountAddress.toString(),
      issuedAt,
      publicKey: account.publicKey.toString(),
      signature: Buffer.from(signed.signature.toUint8Array()).toString("base64"),
      fullMessage: signed.fullMessage,
      ...extra,
    }),
  });
}

test("collections are cleaned the same way everywhere", () => {
  const result = cleanCollection({ title: "  My   series ", description: "x", items: ["a.mp4", "b.mp4", "a.mp4"] });

  assert.equal(result.ok, true);

  assert.deepEqual(result.ok && result.data.items, ["a.mp4", "b.mp4"]);

  assert.equal(result.ok && result.data.title, "My series");

  assert.equal(cleanCollection({ title: "", description: "", items: ["a"] }).ok, false);

  assert.equal(cleanCollection({ title: "t", description: "", items: [] }).ok, false);

  assert.equal(cleanCollection({ title: "t", description: "", items: Array.from({ length: 101 }, (_, i) => `f${i}`) }).ok, false);
});

test("a signed action is accepted only for the exact content that was signed", async () => {
  const account = Account.generate();

  const fields = collectionFields("0a0b0c0d", { title: "T", description: "", items: ["a.mp4"] });

  const good = await readSigned(await signedRequest(account, "save-collection", fields), "t1", 100, "save-collection", () => fields);

  assert.ok(!(good instanceof Response));

  // The same signature cannot be reused for different content.
  const other = collectionFields("0a0b0c0d", { title: "T", description: "", items: ["evil.mp4"] });

  const bad = await readSigned(await signedRequest(account, "save-collection", fields), "t2", 100, "save-collection", () => other);

  assert.ok(bad instanceof Response);

  assert.equal((bad as Response).status, 401);

  // Nor for a different action.
  const wrongAction = await readSigned(await signedRequest(account, "save-collection", fields), "t3", 100, "delete-collection", () => fields);

  assert.equal((wrongAction as Response).status, 401);
});

test("someone else's wallet cannot act as the owner", async () => {
  const owner = Account.generate();

  const attacker = Account.generate();

  const fields = ["x"];

  const request = await signedRequest(attacker, "delete-collection", fields, { owner: owner.accountAddress.toString() });

  const result = await readSigned(request, "t4", 100, "delete-collection", () => fields);

  assert.equal((result as Response).status, 401);
});

test("signed routes are rate limited", async () => {
  const account = Account.generate();

  let last: unknown;

  for (let i = 0; i < 4; i++) {
    last = await readSigned(await signedRequest(account, "a", ["x"], {}, "7.7.7.7"), "rl", 3, "a", () => ["x"]);
  }

  assert.equal((last as Response).status, 429);
});

test("the document store keeps, lists, counts and deletes", async () => {
  const { docs } = await import("@/lib/store/docs");

  await docs.put("note", "s1", "a", { n: 1 });
  await docs.put("note", "s1", "b", { n: 2 });
  await docs.put("note", "s2", "c", { n: 3 });

  assert.equal((await docs.list("note", "s1")).length, 2);
  assert.equal((await docs.listKind("note")).length, 3);

  await docs.put("note", "s1", "a", { n: 9 });

  assert.equal((await docs.get<{ n: number }>("note", "s1", "a"))?.data.n, 9);

  await docs.incr("count", "s1", "x", { plays: 1, seconds: 30 });
  await docs.incr("count", "s1", "x", { plays: 1, seconds: 12.5 });

  assert.deepEqual((await docs.get("count", "s1", "x"))?.data, { plays: 2, seconds: 42.5 });

  await assert.rejects(() => docs.incr("count", "s1", "x", { "bad key; drop": 1 }));

  await docs.del("note", "s1", "a");

  assert.equal(await docs.get("note", "s1", "a"), null);
});
