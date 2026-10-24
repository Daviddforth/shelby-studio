import assert from "node:assert/strict";
import { test } from "node:test";

import { runPool } from "@/lib/services/runPool";

test("every item runs, never more than the limit at once", async () => {
  let running = 0;
  let peak = 0;

  const done: number[] = [];

  await runPool(12, 3, async (index) => {
    running += 1;
    peak = Math.max(peak, running);

    await new Promise((resolve) => setTimeout(resolve, 5));

    running -= 1;
    done.push(index);
  });

  assert.equal(done.length, 12);
  assert.ok(peak <= 3);
});

test("a failing item is retried and then succeeds", async () => {
  let calls = 0;

  await runPool(
    1,
    1,
    async () => {
      calls += 1;

      if (calls < 3) throw new Error("temporary");
    },
    { attempts: 4, pauseMs: 1 }
  );

  assert.equal(calls, 3);
});

test("an error that should not be retried stops immediately", async () => {
  let calls = 0;

  await assert.rejects(
    runPool(
      1,
      1,
      async () => {
        calls += 1;

        throw new Error("forbidden");
      },
      { attempts: 5, pauseMs: 1, isRetryable: () => false }
    ),
    /forbidden/
  );

  assert.equal(calls, 1);
});
