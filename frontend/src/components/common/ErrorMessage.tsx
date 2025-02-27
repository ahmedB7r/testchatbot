import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  showRetry = true,
}) => {
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2">
        <svg
          className="h-5 w-5 text-red-500 dark:text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          {message}
        </p>
      </div>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline focus:outline-none"
        >
          Try again
        </button>
      )}
    </div>
  );
};
