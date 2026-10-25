import assert from "node:assert/strict";
import { test } from "node:test";

import { Account } from "@aptos-labs/ts-sdk";

import { SignatureError, verifyWalletMessage } from "@/lib/media/auth";
import { signWalletMessage } from "@/lib/media/clientSign";
import { TIP_FUNCTION, buildFollowMessage, formatApt } from "@/lib/social/types";
import { checkTipTransaction } from "@/lib/tips/verify";

import { fakeWallet } from "./helpers";

const creator = "0x" + "c".repeat(64);

function tx(overrides: Record<string, unknown> = {}) {
  return {
    type: "user_transaction",
    success: true,
    sender: "0x" + "a".repeat(64),
    payload: {
      type: "entry_function_payload",
      function: TIP_FUNCTION,
      arguments: [creator, "50000000"],
    },
    ...overrides,
  };
}

test("a real APT transfer to the creator counts", () => {
  const result = checkTipTransaction(tx(), creator);

  assert.deepEqual(result, { ok: true, from: "0x" + "a".repeat(64), amount: "50000000" });
});

test("a transfer to somebody else does not count", () => {
  const other = tx({ payload: { type: "entry_function_payload", function: TIP_FUNCTION, arguments: ["0x" + "d".repeat(64), "50000000"] } });

  assert.equal(checkTipTransaction(other, creator).ok, false);
});

test("failed, wrong-function and tiny transfers do not count", () => {
  assert.equal(checkTipTransaction(tx({ success: false }), creator).ok, false);

  assert.equal(
    checkTipTransaction(tx({ payload: { type: "entry_function_payload", function: "0x1::coin::transfer", arguments: [creator, "50000000"] } }), creator).ok,
    false
  );

  assert.equal(
    checkTipTransaction(tx({ payload: { type: "entry_function_payload", function: TIP_FUNCTION, arguments: [creator, "5"] } }), creator).ok,
    false
  );

  assert.equal(checkTipTransaction(null, creator).ok, false);
});

test("tipping yourself does not count", () => {
  assert.equal(checkTipTransaction(tx({ sender: creator }), creator).ok, false);
});

test("amounts are shown in APT", () => {
  assert.equal(formatApt("100000000"), "1");

  assert.equal(formatApt("50000000"), "0.5");

  assert.equal(formatApt("1500000"), "0.015");
});

test("a follow is signed by the follower, for one creator and one action", async () => {
  const me = Account.generate();

  const issuedAt = new Date().toISOString();

  const proof = await signWalletMessage({
    signMessage: fakeWallet(me),
    account: { publicKey: me.publicKey },
    message: buildFollowMessage(creator, "follow", issuedAt),
  });

  const request = { owner: me.accountAddress.toString(), issuedAt, ...proof };

  await verifyWalletMessage(request, buildFollowMessage(creator, "follow", issuedAt));

  await assert.rejects(() => verifyWalletMessage(request, buildFollowMessage(creator, "unfollow", issuedAt)), SignatureError);

  await assert.rejects(
    () => verifyWalletMessage(request, buildFollowMessage("0x" + "e".repeat(64), "follow", issuedAt)),
    SignatureError
  );
});
