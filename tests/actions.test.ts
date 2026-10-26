import assert from "node:assert/strict";
import { test } from "node:test";

import { Account } from "@aptos-labs/ts-sdk";

import { signAction } from "@/lib/actionsClient";
import { readSigned } from "@/lib/apiServer";
import { cleanCollection, collectionFields } from "@/lib/collections/types";

import { fakeWallet } from "./helpers";

function walletFor(account: Account) {
  return {
    signMessage: fakeWallet(account),
    account: { publicKey: account.publicKey },
    walletAddress: account.accountAddress.toString(),
  };
}

function post(body: unknown, ip = "9.9.9.9") {
  return new Request("http://localhost/api/x", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

test("a signed action is accepted for the content that was signed", async () => {
  const me = Account.generate();

  const data = { id: "abcd1234", title: "Season 1", description: "", items: ["a.mp4", "b.mp4"] };

  const proof = await signAction(walletFor(me), "save-collection", collectionFields(data.id, data));

  const result = await readSigned(post({ ...data, ...proof }, "1.1.1.1"), "t1", 50, "save-collection", () =>
    collectionFields(data.id, data)
  );

  assert.ok(!(result instanceof Response));
  assert.equal(result.owner, me.accountAddress.toString());
});

test("changing the content after signing is rejected", async () => {
  const me = Account.generate();

  const data = { id: "abcd1234", title: "Season 1", description: "", items: ["a.mp4"] };

  const proof = await signAction(walletFor(me), "save-collection", collectionFields(data.id, data));

  const tampered = { ...data, items: ["a.mp4", "stolen.mp4"] };

  const result = await readSigned(post({ ...tampered, ...proof }, "1.1.1.2"), "t2", 50, "save-collection", () =>
    collectionFields(tampered.id, tampered)
  );

  assert.ok(result instanceof Response);
  assert.equal(result.status, 401);
});

test("a signature for one action cannot be used for another", async () => {
  const me = Account.generate();

  const proof = await signAction(walletFor(me), "save-collection", ["abcd1234"]);

  const result = await readSigned(post({ id: "abcd1234", ...proof }, "1.1.1.3"), "t3", 50, "delete-collection", (body) => [
    body.id as string,
  ]);

  assert.ok(result instanceof Response);
  assert.equal(result.status, 401);
});

test("someone else's address cannot be claimed", async () => {
  const me = Account.generate();

  const victim = Account.generate();

  const proof = await signAction(walletFor(me), "delete-collection", ["abcd1234"]);

  const result = await readSigned(
    post({ id: "abcd1234", ...proof, owner: victim.accountAddress.toString() }, "1.1.1.4"),
    "t4",
    50,
    "delete-collection",
    (body) => [body.id as string]
  );

  assert.ok(result instanceof Response);
  assert.equal(result.status, 401);
});

test("collections are cleaned the same way for everyone", () => {
  const ok = cleanCollection({ title: "  My   mix ", description: "x", items: ["a", "a", "b"] });

  assert.ok(ok.ok);
  assert.equal(ok.ok && ok.data.title, "My mix");
  assert.deepEqual(ok.ok && ok.data.items, ["a", "b"]);

  assert.equal(cleanCollection({ title: "", description: "", items: ["a"] }).ok, false);
  assert.equal(cleanCollection({ title: "t", description: "", items: [] }).ok, false);
  assert.equal(cleanCollection({ title: "t\u0000", description: "", items: ["a"] }).ok, false);
});
