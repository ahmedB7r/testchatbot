import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/error";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      code: err.statusCode,
    });
  }

  // Handle unexpected errors
  console.error("Unexpected error:", err);
  return res.status(500).json({
    status: "error",
    message: "An unexpected error occurred",
    code: 500,
  });
};

// Retry mechanism for async operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `Attempt ${attempt}/${maxRetries} failed:`,
        error instanceof Error ? error.message : "Unknown error"
      );

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError!;
};

// Async handler wrapper to avoid try-catch blocks in routes
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
