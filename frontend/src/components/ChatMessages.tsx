import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { Message, Chat } from "../services/api";
import TypingIndicator from "./TypingIndicator";
import { useParams } from "react-router-dom";

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isAI = message.role === "assistant";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
          isAI
            ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
            : "bg-blue-600 text-white rounded-br-none"
        }`}
      >
        <p className="text-sm sm:text-base">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

const ChatMessages: React.FC = () => {
  const { chats, isLoading, isTyping, error, loadChat } = useChat();
  const { chatId } = useParams<{ chatId: string }>();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat data when chatId changes
  useEffect(() => {
    if (chatId) {
      // First try to get from existing chats
      const existingChat = chats.find((c) => c.id === chatId);
      if (existingChat) {
        setCurrentChat(existingChat);
      } else {
        // If not found, load from API
        loadChat(chatId)
          .then((chat) => {
            setCurrentChat(chat);
          })
          .catch(() => {
            setCurrentChat(null);
          });
      }
    } else {
      setCurrentChat(null);
    }
  }, [chatId, chats, loadChat]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, isTyping]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading && (!currentChat || currentChat.messages.length === 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">
          Start a new chat or select an existing one
        </p>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {currentChat.messages.map((message: Message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
