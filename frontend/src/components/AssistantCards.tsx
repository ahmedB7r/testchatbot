import {
  BeakerIcon,
  ScaleIcon,
  ChatBubbleBottomCenterTextIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType } from "react";
import { useState, useEffect } from "react";
import { assistantApi, type Assistant as ApiAssistant } from "../services/api";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  BeakerIcon,
  ScaleIcon,
  ChatBubbleBottomCenterTextIcon,
  AcademicCapIcon,
};

// Define beautiful gradient combinations for cards
const gradientClasses = [
  "from-purple-500 to-indigo-600", // Deep purple to indigo
  "from-blue-400 to-cyan-500", // Ocean blue to cyan
  "from-emerald-400 to-teal-500", // Emerald to teal
  "from-rose-400 to-pink-600", // Rose to pink
  "from-amber-400 to-orange-500", // Amber to orange
  "from-violet-500 to-purple-600", // Violet to purple
  "from-cyan-400 to-blue-500", // Cyan to blue
  "from-fuchsia-400 to-pink-600", // Fuchsia to pink
];

const AssistantCards: React.FC<{
  onSelectAssistant: (assistant: ApiAssistant) => void;
}> = ({ onSelectAssistant }) => {
  const [assistants, setAssistants] = useState<ApiAssistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssistants = async () => {
      try {
        const data = await assistantApi.getAssistants();
        setAssistants(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load assistants"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAssistants();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
          >
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {assistants.map((assistant, index) => {
        const Icon =
          iconMap[assistant.iconName] || ChatBubbleBottomCenterTextIcon;
        const gradientClass = gradientClasses[index % gradientClasses.length];

        return (
          <button
            key={assistant.id}
            className={`group relative p-6 rounded-xl bg-gradient-to-br ${gradientClass}
              hover:shadow-xl hover:scale-105 transform transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:ring-blue-500
              dark:shadow-lg dark:shadow-${gradientClass.split("-")[1]}/20`}
            onClick={() => onSelectAssistant(assistant)}
          >
            <div className="relative z-10 flex flex-col items-center text-white">
              <div
                className="p-3 bg-white/10 rounded-lg backdrop-blur-sm mb-4 group-hover:bg-white/20 transition-colors
                            shadow-inner ring-1 ring-white/20"
              >
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2 drop-shadow-sm">
                {assistant.name}
              </h3>
              <p className="text-sm text-center leading-relaxed text-white/90 group-hover:text-white/100 transition-colors">
                {assistant.description}
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          </button>
        );
      })}
    </div>
  );
};

export default AssistantCards;
