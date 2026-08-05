import { logger } from "./logger";

export async function apiRequest<T>(
  promise: Promise<T>
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    logger.error(
      "API Request Failed",
      error
    );

    throw error;
  }
}