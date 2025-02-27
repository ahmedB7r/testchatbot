import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none">
        <div className="flex space-x-2">
          <div
            className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
