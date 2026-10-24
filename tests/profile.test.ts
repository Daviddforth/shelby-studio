import assert from "node:assert/strict";
import { test } from "node:test";

import { BIO_MAX, NAME_MAX, profileLabel, sanitizeProfile } from "@/lib/profile/types";

function ok(input: Parameters<typeof sanitizeProfile>[0]) {
  const result = sanitizeProfile(input);

  assert.equal(result.ok, true);

  return result.ok ? result.profile : null!;
}

test("names and bios are trimmed and limited", () => {
  const profile = ok({ displayName: `  ${"a".repeat(100)}  `, bio: "b".repeat(1000) });

  assert.equal(profile.displayName.length, NAME_MAX);
  assert.equal(profile.bio.length, BIO_MAX);
});

test("control characters cannot get into a name", () => {
  assert.equal(ok({ displayName: "Ada\u0000\nLovelace" }).displayName, "Ada Lovelace");
});

test("X handles lose a leading @ and reject bad characters", () => {
  assert.equal(ok({ twitter: "@ada_x" }).twitter, "ada_x");

  assert.equal(sanitizeProfile({ twitter: "bad handle!" }).ok, false);

  assert.equal(sanitizeProfile({ twitter: "x".repeat(16) }).ok, false);
});

test("websites must be http or https", () => {
  assert.equal(ok({ website: "example.com" }).website, "https://example.com/");

  assert.equal(sanitizeProfile({ website: "javascript:alert(1)" }).ok, false);

  assert.equal(sanitizeProfile({ website: "data:text/html,hi" }).ok, false);
});

test("an empty profile falls back to a short wallet address", () => {
  const label = profileLabel(null, "0x1234567890abcdef1234567890abcdef");

  assert.ok(label.startsWith("0x123456"));
  assert.ok(label.includes("…"));
});
