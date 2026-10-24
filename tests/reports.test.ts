import assert from "node:assert/strict";
import { test } from "node:test";

import { isReportablePath } from "@/lib/reports/types";

test("only pages on this site can be reported", () => {
  assert.equal(isReportablePath("media", "/m/0xabc/clips/launch.mp4"), true);

  assert.equal(isReportablePath("creator", "/c/0xabc"), true);

  assert.equal(isReportablePath("live", "/live/0123456789abcdef0123"), true);

  assert.equal(isReportablePath("media", "https://evil.example/m/0xabc/a.mp4"), false);

  assert.equal(isReportablePath("creator", "/c/not-a-wallet"), false);

  assert.equal(isReportablePath("live", "/live/short"), false);

  assert.equal(isReportablePath("media", "/m/0xabc/" + "a".repeat(400)), false);
});
