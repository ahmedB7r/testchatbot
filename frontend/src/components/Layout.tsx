import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md transition-colors z-50"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

const Layout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header onToggleSidebar={() => setShowSidebar(!showSidebar)} />
      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <aside className="hidden md:block w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <Sidebar className="h-full" />
          </aside>
        )}
        <main className="flex-1 flex flex-col min-w-0">
          <Outlet />
        </main>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Layout;
