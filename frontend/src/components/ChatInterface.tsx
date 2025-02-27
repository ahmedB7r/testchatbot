import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useChat } from "../contexts/ChatContext";
import { useNavigate, useParams } from "react-router-dom";
import { Assistant } from "../services/api";

interface ChatInterfaceProps {
  selectedAssistant?: Assistant | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedAssistant }) => {
  const [message, setMessage] = useState<string>("");
  const { sendMessage, isLoading, isTyping } = useChat();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      const newChatId = await sendMessage(
        chatId || null,
        message,
        selectedAssistant?.id
      );
      setMessage("");

      // If this was a new chat, navigate to its page
      if (!chatId) {
        navigate(`/chat/${newChatId}`);
      }
    }
  };

  const isDisabled = isLoading || isTyping;
  const placeholder = selectedAssistant
    ? `Ask ${selectedAssistant.name}...`
    : chatId
    ? isTyping
      ? "AI is typing..."
      : "Type your message..."
    : "Select an assistant or type to start a new chat...";

  return (
    <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="py-4">
          <div className="relative flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              disabled={isDisabled}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl pl-4 pr-12 py-3 text-base placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!message.trim() || isDisabled}
              className="absolute right-2 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all duration-200"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
