import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin dark:border-gray-700 dark:border-t-blue-400`}
      />
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
      )}
    </div>
  );
};
