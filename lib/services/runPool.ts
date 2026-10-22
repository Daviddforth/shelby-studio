/**
 * Runs `worker(0..count-1)` with at most `concurrency` running at once.
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
  } = {}
): Promise<void> {
  const attempts = options.attempts ?? 3;
  const pauseMs = options.pauseMs ?? 800;
  const isRetryable = options.isRetryable ?? (() => true);

  let next = 0;
  let failure: unknown = null;
  let failed = false;

  async function runOne(index: number) {
    for (let attempt = 1; ; attempt++) {
      try {
        await worker(index);
        return;
      } catch (error) {
        if (!isRetryable(error) || attempt >= attempts) throw error;

        await new Promise((resolve) => setTimeout(resolve, pauseMs * attempt));
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, count) }, async () => {
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
