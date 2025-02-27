interface ErrorResponse {
  message: string;
  code?: string;
  retry?: boolean;
}

export class AppError extends Error {
  code?: string;
  retry?: boolean;

  constructor({ message, code, retry = true }: ErrorResponse) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.retry = retry;
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError({
      message: error.message,
      code: "UNKNOWN_ERROR",
    });
  }

  return new AppError({
    message: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
  });
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        throw new AppError({
          message: `Operation failed after ${maxRetries} attempts: ${lastError.message}`,
          code: "MAX_RETRIES_EXCEEDED",
          retry: false,
        });
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  // This should never be reached due to the throw above, but TypeScript needs it
  throw lastError;
};

export const getFallbackResponse = <T>(defaultValue: T): T => {
  return defaultValue;
};
