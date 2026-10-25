import assert from "node:assert/strict";
import test from "node:test";

import { shouldNotify } from "../lib/push/server";
import { buildNotifyMessage } from "../lib/social/types";

test("a creator can notify followers once per ten minutes", () => {
  const t = 1_000_000_000_000;

  assert.equal(shouldNotify("0xaaa", t), true);
  assert.equal(shouldNotify("0xaaa", t + 60_000), false);
  assert.equal(shouldNotify("0xbbb", t + 60_000), true);
  assert.equal(shouldNotify("0xaaa", t + 11 * 60_000), true);
});

test("the notify message names the wallet and action", () => {
  assert.equal(buildNotifyMessage("0xABC", "on", "now"), "Shelby Studio: notify on 0xabc | now");
});
