import assert from "node:assert/strict";
import { test } from "node:test";

import { Account } from "@aptos-labs/ts-sdk";

import { SignatureError, verifyWalletMessage } from "@/lib/media/auth";
import { signLiveRequest } from "@/lib/media/clientSign";
import { buildLiveMessage } from "@/lib/live/types";
import { signProfileRequest } from "@/lib/profile/clientSign";
import { buildProfileMessage, canonicalProfile, EMPTY_PROFILE } from "@/lib/profile/types";
import { sha256Hex } from "@/lib/media/types";

import { fakeWallet } from "./helpers";

async function profileRequest(signer: Account, owner: string) {
  const profile = { ...EMPTY_PROFILE, displayName: "Ada", bio: "Hello" };

  const request = await signProfileRequest({
    signMessage: fakeWallet(signer),
    account: { publicKey: signer.publicKey },
    owner,
    profile,
  });

  const hash = await sha256Hex(canonicalProfile(owner, profile));

  return { request, expected: buildProfileMessage(hash, request.issuedAt) };
}

test("the owner's own signature is accepted", async () => {
  const me = Account.generate();

  const { request, expected } = await profileRequest(me, me.accountAddress.toString());

  await verifyWalletMessage(request, expected);
});

test("a signature from a different wallet is rejected", async () => {
  const victim = Account.generate();

  const attacker = Account.generate();

  const { request, expected } = await profileRequest(attacker, victim.accountAddress.toString());

  await assert.rejects(() => verifyWalletMessage(request, expected), SignatureError);
});

test("changing the content after signing is rejected", async () => {
  const me = Account.generate();

  const owner = me.accountAddress.toString();

  const { request } = await profileRequest(me, owner);

  const tamperedHash = await sha256Hex(
    canonicalProfile(owner, { ...EMPTY_PROFILE, displayName: "Ada", bio: "Hacked" })
  );

  await assert.rejects(
    () => verifyWalletMessage(request, buildProfileMessage(tamperedHash, request.issuedAt)),
    SignatureError
  );
});

test("an old signature is rejected", async () => {
  const me = Account.generate();

  const { request, expected } = await profileRequest(me, me.accountAddress.toString());

  await assert.rejects(
    () => verifyWalletMessage(request, expected, Date.now() + 10 * 60_000),
    /expired/
  );
});

test("a go-live signature only works for its own title", async () => {
  const me = Account.generate();

  const owner = me.accountAddress.toString();

  const request = await signLiveRequest({
    signMessage: fakeWallet(me),
    account: { publicKey: me.publicKey },
    owner,
    title: "Hello",
  });

  await verifyWalletMessage(request, buildLiveMessage(owner, "Hello", request.issuedAt));

  await assert.rejects(
    () => verifyWalletMessage(request, buildLiveMessage(owner, "Other title", request.issuedAt)),
    SignatureError
  );
});
