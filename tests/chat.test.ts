import assert from "node:assert/strict";
import { test } from "node:test";

import { containsBlockedWord, parseBlockedWords } from "@/lib/live/chat";

test("blocked word lists are cleaned up", () => {
  assert.deepEqual(parseBlockedWords(" Spam, scam ,SPAM,\n x ,"), ["spam", "scam"]);
});

test("blocked words match ignoring case and punctuation", () => {
  const blocked = ["scam"];

  assert.equal(containsBlockedWord("This is a SCAM!", blocked), true);

  assert.equal(containsBlockedWord("s.c.a.m", blocked), true);

  assert.equal(containsBlockedWord("a lovely stream", blocked), false);
});

test("an empty list blocks nothing", () => {
  assert.equal(containsBlockedWord("anything", []), false);
});
