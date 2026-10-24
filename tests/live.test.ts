import assert from "node:assert/strict";
import { test } from "node:test";

import { isStreamCode, liveRoomName, liveWatchPath } from "@/lib/live/types";
import { newStreamCode, normalizeOwner } from "@/lib/live/server";

test("stream codes are random, unguessable hex", () => {
  const codes = new Set(Array.from({ length: 200 }, () => newStreamCode()));

  assert.equal(codes.size, 200);

  for (const code of codes) assert.ok(isStreamCode(code));
});

test("anything that is not a stream code is refused", () => {
  assert.equal(isStreamCode("0x" + "a".repeat(64)), false);

  assert.equal(isStreamCode("../etc/passwd"), false);

  assert.equal(isStreamCode("ABCDEF0123456789ABCD"), false);

  assert.equal(isStreamCode(undefined), false);
});

test("the watch link contains the code and no wallet address", () => {
  const code = newStreamCode();

  assert.equal(liveWatchPath(code), `/live/${code}`);

  assert.equal(liveRoomName(code), `live-${code}`);
});

test("wallet addresses are normalized, junk is not", () => {
  assert.equal(normalizeOwner("0x" + "AB".repeat(32)), "0x" + "ab".repeat(32));

  assert.equal(normalizeOwner("0xABC123"), null);

  assert.equal(normalizeOwner("nonsense"), null);

  assert.equal(normalizeOwner(undefined), null);
});
