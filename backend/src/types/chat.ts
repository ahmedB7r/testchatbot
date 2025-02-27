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

export interface CreateChatRequest {
  message: string;
}

export interface SendMessageRequest {
  chatId: string;
  message: string;
  assistantId?: number;
}
