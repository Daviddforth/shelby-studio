export class ShelbyError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "ShelbyError";
  }
}

export function handleError(
  error: unknown
) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
}