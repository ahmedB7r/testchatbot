import React, { useState } from "react";
import ChatInterface from "./ChatInterface";
import AssistantCards from "./AssistantCards";
import { Assistant } from "../services/api";

const Home: React.FC = () => {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    null
  );

  const handleSelectAssistant = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-gray-900">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-white mb-6">
          Internal AI Dashboard
        </h1>

        {/* Assistant Cards Section */}
        <AssistantCards onSelectAssistant={handleSelectAssistant} />

        {/* Chat Interface */}
        <div className="mt-8">
          <ChatInterface selectedAssistant={selectedAssistant} />
        </div>
      </div>
    </div>
  );
};

export default Home;
