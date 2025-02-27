import { PlusIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useChat } from "../contexts/ChatContext";
import { useNavigate, useParams } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const { chats, isLoading } = useChat();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();

  const handleCreateNewChat = () => {
    navigate("/");
  };

  const handleSelectChat = (selectedChatId: string) => {
    navigate(`/chat/${selectedChatId}`);
  };

  return (
    <div className={`bg-gray-800 w-64 flex flex-col h-full ${className}`}>
      <div className="p-4">
        <button
          onClick={handleCreateNewChat}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              disabled={isLoading}
              className={`w-full text-left px-4 py-3 hover:bg-gray-700 flex items-center space-x-3 disabled:opacity-50 ${
                chat.id === chatId ? "bg-gray-700" : ""
              }`}
            >
              <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {chat.title || chat.messages[0]?.content || "New Chat"}
                </p>
                <p className="text-xs text-gray-400">
                  {chat.updatedAt.toLocaleString()}
                </p>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
