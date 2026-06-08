export const API_UNAVAILABLE_MESSAGE = "API_UNAVAILABLE";

export class ApiError extends Error {
  readonly status?: number;
  readonly isNetworkError: boolean;

  constructor(
    message: string,
    options?: { status?: number; isNetworkError?: boolean; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = "ApiError";
    this.status = options?.status;
    this.isNetworkError = options?.isNetworkError ?? false;
  }
}

export class ApiUnavailableError extends ApiError {
  constructor(cause?: unknown) {
    super(API_UNAVAILABLE_MESSAGE, { isNetworkError: true, cause });
    this.name = "ApiUnavailableError";
  }
}

export function isServerUnavailable(error: unknown): boolean {
  if (error instanceof ApiUnavailableError) {
    return true;
  }

  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return true;
    }

    if (error.status !== undefined && error.status >= 500) {
      return true;
    }
  }

  if (error instanceof Error && error.message === API_UNAVAILABLE_MESSAGE) {
    return true;
  }

  return false;
}
