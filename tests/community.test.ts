import assert from "node:assert/strict";
import { promises as fs } from "fs";
import path from "path";
import { after as afterAll, before, test } from "node:test";

import { Account } from "@aptos-labs/ts-sdk";

import { signAction } from "@/lib/actionsClient";
import { decryptBytes, encryptBytes, generateFileKey } from "@/lib/premium/crypto";
import { cleanComment } from "@/lib/comments/types";
import { cleanSchedule, isUpcoming } from "@/lib/schedule/types";
import { premiumSetFields, premiumUnlockFields, validPrice } from "@/lib/premium/types";
import { sha256Hex } from "@/lib/media/types";

import { fakeWallet } from "./helpers";

const DOCS = path.join(process.cwd(), ".data", "docs.json");

let hadDocs = false;
let hadSocial = false;

before(async () => {
  hadSocial = await fs.access(path.join(process.cwd(), ".data", "social.json")).then(() => true, () => false);

  hadDocs = await fs.access(DOCS).then(() => true, () => false);

  process.env.PREMIUM_KEY_SECRET = "test-secret-value-for-premium";
  delete process.env.DATABASE_URL;
});

afterAll(async () => {
  if (!hadDocs) await fs.rm(DOCS, { force: true });

  if (!hadSocial) await fs.rm(path.join(process.cwd(), ".data", "social.json"), { force: true });
});

function walletFor(account: Account) {
  return {
    signMessage: fakeWallet(account),
    account: { publicKey: account.publicKey },
    walletAddress: account.accountAddress.toString(),
  };
}

let ipCounter = 0;

function req(method: string, body: unknown, url = "http://localhost/api/x") {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json", "x-forwarded-for": `10.1.${Math.floor(++ipCounter / 250)}.${ipCounter % 250}` },
    body: JSON.stringify(body),
  });
}

test("a locked file opens only with its own key", async () => {
  const key = await generateFileKey();

  const plain = new TextEncoder().encode("a very private video").buffer as ArrayBuffer;

  const locked = await encryptBytes(plain, key);

  assert.notDeepEqual(Array.from(locked.slice(12, 20)), Array.from(new Uint8Array(plain).slice(0, 8)));

  const back = await decryptBytes(locked.buffer.slice(locked.byteOffset, locked.byteOffset + locked.byteLength) as ArrayBuffer, key);

  assert.equal(new TextDecoder().decode(back), "a very private video");

  const otherKey = await generateFileKey();

  await assert.rejects(() =>
    decryptBytes(locked.buffer.slice(locked.byteOffset, locked.byteOffset + locked.byteLength) as ArrayBuffer, otherKey)
  );
});

test("prices are limited to a sensible range", () => {
  assert.equal(validPrice(1_000_000), true);
  assert.equal(validPrice(999_999), false);
  assert.equal(validPrice(1.5), false);
  assert.equal(validPrice(100_000_000_001), false);
  assert.equal(validPrice("5"), false);
});

test("registering a paid file needs the owner's signature and a matching key", async () => {
  const { POST } = await import("@/app/api/premium/route");

  const me = Account.generate();

  const key = await generateFileKey();

  const keyHash = await sha256Hex(key);

  const proof = await signAction(walletFor(me), "premium-set", premiumSetFields("movie.mp4", 5_000_000, keyHash));

  const good = await POST(req("POST", { ...proof, blobName: "movie.mp4", priceOctas: 5_000_000, key, keyHash }));

  assert.equal(good.status, 200);

  // A different key than the one that was signed is refused.
  const swapped = await POST(
    req("POST", { ...proof, blobName: "movie.mp4", priceOctas: 5_000_000, key: await generateFileKey(), keyHash })
  );

  assert.equal(swapped.status, 400);

  // Lower price than signed is refused too.
  const cheaper = await POST(req("POST", { ...proof, blobName: "movie.mp4", priceOctas: 1_000_000, key, keyHash }));

  assert.equal(cheaper.status, 401);
});

test("the key is only handed to the owner, never to someone who has not paid", async () => {
  const { POST: register } = await import("@/app/api/premium/route");

  const { POST: unlock } = await import("@/app/api/premium/unlock/route");

  const owner = Account.generate();

  const stranger = Account.generate();

  const key = await generateFileKey();

  const keyHash = await sha256Hex(key);

  const setProof = await signAction(walletFor(owner), "premium-set", premiumSetFields("song.mp3", 2_000_000, keyHash));

  assert.equal((await register(req("POST", { ...setProof, blobName: "song.mp3", priceOctas: 2_000_000, key, keyHash }))).status, 200);

  const ownerAddress = owner.accountAddress.toString();

  const ownerProof = await signAction(walletFor(owner), "premium-unlock", premiumUnlockFields(ownerAddress, "song.mp3", ""));

  const ownerResponse = await unlock(req("POST", { ...ownerProof, creator: ownerAddress, blobName: "song.mp3", hash: "" }));

  assert.equal(ownerResponse.status, 200);
  assert.equal((await ownerResponse.json()).key, key);

  const strangerProof = await signAction(walletFor(stranger), "premium-unlock", premiumUnlockFields(ownerAddress, "song.mp3", ""));

  const strangerResponse = await unlock(req("POST", { ...strangerProof, creator: ownerAddress, blobName: "song.mp3", hash: "" }));

  assert.equal(strangerResponse.status, 402);
  assert.equal(JSON.stringify(await strangerResponse.json()).includes(key), false);

  const missingProof = await signAction(walletFor(stranger), "premium-unlock", premiumUnlockFields(ownerAddress, "other.mp3", ""));

  assert.equal((await unlock(req("POST", { ...missingProof, creator: ownerAddress, blobName: "other.mp3", hash: "" }))).status, 404);
});

test("comments are cleaned and limited", () => {
  assert.equal(cleanComment("  hello  ").ok, true);
  assert.equal(cleanComment("   ").ok, false);
  assert.equal(cleanComment("x".repeat(501)).ok, false);
  assert.equal(cleanComment("bad\u0000text").ok, false);
});

test("only the author or the page owner can delete a comment", async () => {
  const { DELETE } = await import("@/app/api/comments/route");

  const { docs } = await import("@/lib/store/docs");

  const owner = Account.generate();

  const author = Account.generate();

  const other = Account.generate();

  const ownerAddress = owner.accountAddress.toString();

  const scope = `${ownerAddress.toLowerCase()}|clip.mp4`;

  async function attempt(who: Account, id: string) {
    const proof = await signAction(walletFor(who), "delete-comment", [ownerAddress.toLowerCase(), "clip.mp4", id]);

    return DELETE(req("DELETE", { ...proof, creator: ownerAddress, target: "clip.mp4", id }));
  }

  for (const id of ["c1", "c2", "c3"]) {
    await docs.put("comment", scope, id, { author: author.accountAddress.toString(), body: "hi" });
  }

  assert.equal((await attempt(other, "c1")).status, 403);
  assert.ok(await docs.get("comment", scope, "c1"));

  assert.equal((await attempt(author, "c1")).status, 200);
  assert.equal(await docs.get("comment", scope, "c1"), null);

  assert.equal((await attempt(owner, "c2")).status, 200);
  assert.equal(await docs.get("comment", scope, "c2"), null);
});

test("schedules must be in the near future", () => {
  const now = Date.now();

  assert.equal(cleanSchedule({ title: "Q&A", startsAt: new Date(now + 3600_000).toISOString() }, now).ok, true);
  assert.equal(cleanSchedule({ title: "Q&A", startsAt: new Date(now - 3600_000).toISOString() }, now).ok, false);
  assert.equal(cleanSchedule({ title: "Q&A", startsAt: new Date(now + 40 * 86400_000).toISOString() }, now).ok, false);
  assert.equal(cleanSchedule({ title: "", startsAt: new Date(now + 3600_000).toISOString() }, now).ok, false);
  assert.equal(isUpcoming({ startsAt: new Date(now - 3 * 3600_000).toISOString() }, now), false);
  assert.equal(isUpcoming({ startsAt: new Date(now - 30 * 60_000).toISOString() }, now), true);
});

test("watch time adds up, is capped per report, and stays per file", async () => {
  const { POST, GET } = await import("@/app/api/watch/route");

  const owner = Account.generate().accountAddress.toString();

  assert.equal((await POST(req("POST", { owner, target: "a.mp4", seconds: 30, play: true }))).status, 200);
  assert.equal((await POST(req("POST", { owner, target: "a.mp4", seconds: 500, play: false }))).status, 200);
  assert.equal((await POST(req("POST", { owner, target: "b.mp4", seconds: 10, play: true }))).status, 200);
  assert.equal((await POST(req("POST", { owner, target: "a.mp4", seconds: -5 }))).status, 400);

  const { stats } = await (await GET(new Request(`http://localhost/api/watch?owner=${owner}`))).json();

  assert.deepEqual(stats["a.mp4"], { seconds: 90, plays: 1 });
  assert.deepEqual(stats["b.mp4"], { seconds: 10, plays: 1 });
});

test("the Telegram bot only listens to Telegram, links with a one-time code, and unlinks on /stop", async () => {
  process.env.TELEGRAM_BOT_TOKEN = "123:abc";
  process.env.TELEGRAM_BOT_USERNAME = "ShelbyTestBot";
  process.env.TELEGRAM_WEBHOOK_SECRET = "hook-secret-1";

  const sent: Array<{ chat_id: string; text: string }> = [];

  const realFetch = globalThis.fetch;

  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    if (String(url).startsWith("https://api.telegram.org/")) {
      sent.push(JSON.parse(String(init?.body)));

      return new Response("{}", { status: 200 });
    }

    return realFetch(url, init);
  }) as typeof fetch;

  try {
    const { POST: link } = await import("@/app/api/telegram/route");
    const { POST: hook } = await import("@/app/api/telegram/webhook/route");
    const { isLinked, telegramToFollowers } = await import("@/lib/telegram/server");
    const { social } = await import("@/lib/social/db");

    const me = Account.generate();

    const creator = Account.generate().accountAddress.toString();

    const mine = me.accountAddress.toString();

    const proof = await signAction(walletFor(me), "telegram-link", ["link"]);

    const linkResponse = await link(req("POST", proof));

    assert.equal(linkResponse.status, 200);

    const code = /start=([0-9a-f]{24})$/.exec((await linkResponse.json()).url)?.[1] ?? "";

    assert.ok(code);

    const update = (text: string, secret = "hook-secret-1", type = "private") =>
      new Request("http://localhost/api/telegram/webhook", {
        method: "POST",
        headers: { "x-telegram-bot-api-secret-token": secret },
        body: JSON.stringify({ message: { text, chat: { id: 4242, type } } }),
      });

    // Wrong secret, and group chats, are ignored.
    assert.equal((await hook(update(`/start ${code}`, "nope"))).status, 403);

    await hook(update(`/start ${code}`, "hook-secret-1", "group"));

    assert.equal(await isLinked(mine), false);

    await hook(update(`/start ${code}`));

    assert.equal(await isLinked(mine), true);

    // The code works once.
    sent.length = 0;

    await hook(update(`/start ${code}`));

    assert.match(sent[0].text, /expired/);

    // A follower is messaged when the creator they follow goes live.
    await social.setFollow(mine, creator, true);

    sent.length = 0;

    const count = await telegramToFollowers(creator, { title: "Ada is live", body: "Q&A", url: "/live/abc" });

    assert.equal(count, 1);
    assert.equal(sent[0].chat_id, "4242");
    assert.match(sent[0].text, /Ada is live/);

    await hook(update("/stop"));

    assert.equal(await isLinked(mine), false);

    await social.setFollow(mine, creator, false);
  } finally {
    globalThis.fetch = realFetch;
  }
});
