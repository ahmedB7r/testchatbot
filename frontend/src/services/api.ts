import axios from "axios";

// Define base API URL
const API_BASE_URL =
  "http://xkgoockg8w80kc0gc084sc0o.147.79.100.132.sslip.io/api";

// Types
export interface Assistant {
  id: number;
  name: string;
  description: string;
  iconName: string;
  color: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  assistantId?: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  chatId: string;
  chatTitle: string;
  message: Message;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: SearchResult[];
}

export interface ErrorResponse {
  status: "error";
  message: string;
  code: number;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API error handler
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const errorData = error.response.data as ErrorResponse;
    throw new Error(errorData.message || "An error occurred");
  } else if (axios.isAxiosError(error) && error.request) {
    throw new Error("No response from server. Please check your connection.");
  }
  throw new Error("Failed to make request. Please try again.");
};

// Helper function to convert dates in response data
const convertDates = (data: any): any => {
  if (data instanceof Array) {
    return data.map(convertDates);
  }
  if (data instanceof Object) {
    if (data.timestamp) {
      data.timestamp = new Date(data.timestamp);
    }
    if (data.createdAt) {
      data.createdAt = new Date(data.createdAt);
    }
    if (data.updatedAt) {
      data.updatedAt = new Date(data.updatedAt);
    }
    if (data.messages) {
      data.messages = data.messages.map(convertDates);
    }
    return data;
  }
  return data;
};

// Chat APIs
export const chatApi = {
  // Create a new chat
  createChat: async (message: string, assistantId?: number): Promise<Chat> => {
    try {
      // If assistantId is provided, use the assistant-specific endpoint
      if (assistantId) {
        const response = await api.post<Chat>(
          `/chat/assistant/${assistantId}`,
          { message }
        );
        return convertDates(response.data);
      }
      // Otherwise use the general chat endpoint
      const response = await api.post<Chat>("/chat", { message });
      return convertDates(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Send a message in a chat
  sendMessage: async (
    chatId: string,
    message: string,
    assistantId?: number
  ): Promise<Chat> => {
    try {
      const response = await api.post<Chat>(`/chat/message`, {
        chatId,
        message,
        assistantId,
      });
      return convertDates(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get all chats
  getAllChats: async (): Promise<Chat[]> => {
    try {
      const response = await api.get<Chat[]>("/chats");
      return convertDates(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get a specific chat
  getChat: async (chatId: string): Promise<Chat> => {
    try {
      const response = await api.get<Chat>(`/chat/${chatId}`);
      return convertDates(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Search messages
  searchMessages: async (query: string): Promise<SearchResponse> => {
    try {
      const response = await api.get<SearchResponse>("/search", {
        params: { query },
      });
      return convertDates(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Add retry mechanism for failed requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    if (!error.config) {
      return Promise.reject(error);
    }

    const config = error.config as {
      retryCount?: number;
    } & typeof error.config;

    if (config.retryCount === undefined) {
      config.retryCount = 0;
    }

    if (config.retryCount < maxRetries) {
      config.retryCount += 1;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return api.request(config);
    }

    return Promise.reject(error);
  }
);

export const assistantApi = {
  // Get all available assistants
  getAssistants: async (): Promise<Assistant[]> => {
    try {
      const response = await api.get<Assistant[]>("/assistants");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Start a chat with a specific assistant
  startAssistantChat: async (
    assistantId: number,
    message: string
  ): Promise<Chat> => {
    try {
      const response = await api.post<Chat>(`/chat/assistant/${assistantId}`, {
        message,
      });
      return convertDates(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default api;
