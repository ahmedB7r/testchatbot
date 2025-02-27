import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useChat } from "../contexts/ChatContext";
import ChatMessages from "./ChatMessages";
import ChatInterface from "./ChatInterface";

const ChatView: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { loadChat, error } = useChat();

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    }
  }, [chatId, loadChat]);

  if (error) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <ChatMessages />
      </div>
      <ChatInterface />
    </>
  );
};

export default ChatView;
