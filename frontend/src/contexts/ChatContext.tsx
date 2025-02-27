import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { chatApi, Chat, SearchResponse } from "../services/api";
import { useLoading } from "./LoadingContext";

interface ChatContextType {
  chats: Chat[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  sendMessage: (
    chatId: string | null,
    message: string,
    assistantId?: number
  ) => Promise<string>;
  createNewChat: (message: string, assistantId?: number) => Promise<string>;
  loadChat: (chatId: string) => Promise<Chat>;
  searchMessages: (query: string) => Promise<SearchResponse>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { setLoading, setLoadingMessage } = useLoading();

  // Load all chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  // Load all chats
  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingMessage("Loading chats...");
      const fetchedChats = await chatApi.getAllChats();
      setChats(fetchedChats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setLoadingMessage]);

  // Create a new chat
  const createNewChat = useCallback(
    async (message: string, assistantId?: number) => {
      try {
        setLoading(true);
        setLoadingMessage("Creating new chat...");
        setIsTyping(true);
        const newChat = await chatApi.createChat(message, assistantId);
        setChats((prev) => [...prev, newChat]);
        setError(null);
        return newChat.id;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create chat");
        throw err;
      } finally {
        setLoading(false);
        setIsTyping(false);
      }
    },
    [setLoading, setLoadingMessage]
  );

  // Load a specific chat
  const loadChat = useCallback(
    async (chatId: string) => {
      try {
        setLoading(true);
        setLoadingMessage("Loading chat...");
        const chat = await chatApi.getChat(chatId);
        // Update the chat in the chats list
        setChats((prev) => prev.map((c) => (c.id === chat.id ? chat : c)));
        setError(null);
        return chat;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chat");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setLoadingMessage]
  );

  // Send a message
  const sendMessage = useCallback(
    async (chatId: string | null, message: string, assistantId?: number) => {
      if (!chatId) {
        return createNewChat(message, assistantId);
      }

      try {
        setIsTyping(true);
        const updatedChat = await chatApi.sendMessage(
          chatId,
          message,
          assistantId
        );
        setChats((prev) =>
          prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
        );
        setError(null);
        return chatId;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        throw err;
      } finally {
        setIsTyping(false);
      }
    },
    [createNewChat]
  );

  // Search messages
  const searchMessages = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        setLoadingMessage("Searching messages...");
        const results = await chatApi.searchMessages(query);
        setError(null);
        return results;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search messages"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setLoadingMessage]
  );

  return (
    <ChatContext.Provider
      value={{
        chats,
        isLoading: false,
        isTyping,
        error,
        sendMessage,
        createNewChat,
        loadChat,
        searchMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
