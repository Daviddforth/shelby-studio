/**
 * Runs `worker(0..count-1)` with up to `concurrency` running at once, and adapts.
 *
 * On a slow connection, many uploads at once each get a thin slice of the
 * bandwidth and can hit the server's per-request timeout. So when an item has
 * to be retried, the allowed concurrency is halved (down to 1); after a streak
 * of successes it grows back by one, up to the starting value.
 *
 * A failed item is retried (unless `isRetryable` says no) with a growing pause.
 * The first item that finally fails stops the rest and its error is thrown.
 */
export async function runPool(
  count: number,
  concurrency: number,
  worker: (index: number) => Promise<void>,
  options: {
    attempts?: number;
    isRetryable?: (error: unknown) => boolean;
    pauseMs?: number;
    /** Successes in a row before concurrency grows by one. */
    rampAfter?: number;
    onLimitChange?: (limit: number) => void;
  } = {}
): Promise<void> {
  const attempts = options.attempts ?? 3;
  const pauseMs = options.pauseMs ?? 800;
  const rampAfter = options.rampAfter ?? 8;
  const isRetryable = options.isRetryable ?? (() => true);

  const maxLimit = Math.max(1, Math.min(concurrency, count));

  let limit = maxLimit;
  let inFlight = 0;
  let streak = 0;
  let next = 0;
  let failure: unknown = null;
  let failed = false;

  function setLimit(value: number) {
    if (value === limit) return;

    limit = value;
    options.onLimitChange?.(limit);
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function runOne(index: number) {
    for (let attempt = 1; ; attempt++) {
      // Every attempt, including retries, waits for a free slot under the current limit.
      while (inFlight >= limit) await sleep(20);

      inFlight += 1;

      try {
        await worker(index);

        streak += 1;

        if (streak >= rampAfter && limit < maxLimit) {
          streak = 0;
          setLimit(limit + 1);
        }

        return;
      } catch (error) {
        if (!isRetryable(error) || attempt >= attempts) throw error;

        streak = 0;
        setLimit(Math.max(1, Math.floor(limit / 2)));
      } finally {
        inFlight -= 1;
      }

      await sleep(pauseMs * attempt);
    }
  }

  await Promise.all(
    Array.from({ length: maxLimit }, async () => {
      while (!failed) {
        const index = next++;

        if (index >= count) return;

        try {
          await runOne(index);
        } catch (error) {
          failed = true;
          failure = error;
          return;
        }
      }
    })
  );

  if (failed) throw failure;
}
