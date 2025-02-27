import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  Chat,
  Message,
  CreateChatRequest,
  SendMessageRequest,
} from "../types/chat";
import { NotFoundError, BadRequestError } from "../types/error";
import { withRetry } from "../middleware/errorHandler";
import { storage } from "../utils/storage";

// Simulated typing delay for AI responses (ms)
const AI_TYPING_DELAY = 5000;

interface Assistant {
  id: number;
  name: string;
  description: string;
  iconName: string;
  color: string;
}

// Predefined list of available assistants
const availableAssistants: Assistant[] = [
  {
    id: 1,
    name: "PDF Assistant",
    description: "Analyze and extract insights from PDF documents",
    iconName: "BeakerIcon",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 2,
    name: "Legal Policy GPT",
    description: "Get help with legal documents and policies",
    iconName: "ScaleIcon",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 3,
    name: "General Chat",
    description: "Your all-purpose AI assistant",
    iconName: "ChatBubbleBottomCenterTextIcon",
    color: "from-green-500 to-green-600",
  },
  {
    id: 4,
    name: "Research Assistant",
    description: "Help with academic research and writing",
    iconName: "AcademicCapIcon",
    color: "from-red-500 to-red-600",
  },
];

/**
 * Creates a new chat thread with an initial message
 * @throws {BadRequestError} If message is missing or empty
 */
export const createChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      throw new BadRequestError("Message is required");
    }

    const newChat: Chat = {
      id: uuidv4(),
      title: `Chat ${storage.getChats().length + 1}`,
      messages: [
        {
          id: uuidv4(),
          content: message,
          role: "user",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simulate AI typing delay and add response
    await new Promise((resolve) => setTimeout(resolve, AI_TYPING_DELAY));

    const aiResponse: Message = {
      id: uuidv4(),
      content:
        "This is a mock AI response. Replace with actual AI integration.",
      role: "assistant",
      timestamp: new Date(),
    };
    newChat.messages.push(aiResponse);

    if (!storage.addChat(newChat)) {
      throw new Error("Failed to save chat");
    }

    res.status(201).json(newChat);
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(400).json({
        status: "error",
        message: error.message,
        code: 400,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to create chat",
        code: 500,
      });
    }
  }
};

/**
 * Sends a new message in an existing chat thread
 * @throws {NotFoundError} If chat is not found
 * @throws {BadRequestError} If message is missing or empty
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId, message, assistantId } = req.body;

    if (!message?.trim()) {
      throw new BadRequestError("Message is required");
    }

    const chat = storage.getChat(chatId);
    if (!chat) {
      throw new NotFoundError("Chat not found");
    }

    let assistant: Assistant | undefined;
    if (assistantId) {
      assistant = availableAssistants.find(
        (a) => a.id === parseInt(assistantId.toString(), 10)
      );
      if (!assistant) {
        throw new NotFoundError("Assistant not found");
      }
    }

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content: message,
      role: "user",
      timestamp: new Date(),
      ...(assistant && { assistantId: assistant.id }),
    };
    chat.messages.push(userMessage);
    chat.updatedAt = new Date();

    // Simulate AI typing delay
    await new Promise((resolve) => setTimeout(resolve, AI_TYPING_DELAY));

    // Add AI response
    const aiResponse: Message = {
      id: uuidv4(),
      content: assistant
        ? `This is a mock AI response from ${assistant.name}. Replace with actual AI integration.`
        : "This is a mock AI response. Replace with actual AI integration.",
      role: "assistant",
      timestamp: new Date(),
      ...(assistant && { assistantId: assistant.id }),
    };
    chat.messages.push(aiResponse);

    if (!storage.updateChat(chatId, chat)) {
      throw new Error("Failed to update chat");
    }

    res.json(chat);
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(400).json({
        status: "error",
        message: error.message,
        code: 400,
      });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({
        status: "error",
        message: error.message,
        code: 404,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to send message",
        code: 500,
      });
    }
  }
};

/**
 * Retrieves all chat threads
 */
export const getChats = async (_req: Request, res: Response) => {
  try {
    const chats = storage.getChats();
    res.json(chats);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch chats",
      code: 500,
    });
  }
};

/**
 * Retrieves a specific chat thread by ID
 * @throws {NotFoundError} If chat is not found
 */
export const getChat = async (req: Request, res: Response) => {
  try {
    const chat = storage.getChat(req.params.id);
    if (!chat) {
      throw new NotFoundError("Chat not found");
    }
    res.json(chat);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        status: "error",
        message: error.message,
        code: 404,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch chat",
        code: 500,
      });
    }
  }
};

/**
 * Searches for messages across all chats
 * @param query Search term to look for in message content
 * @returns Array of messages matching the search term with chat context
 */
export const searchMessages = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (typeof query !== "string" || !query.trim()) {
      throw new BadRequestError("Search query is required");
    }

    const chats = storage.getChats();
    const results = chats.flatMap((chat) =>
      chat.messages
        .filter((msg) =>
          msg.content.toLowerCase().includes(query.toLowerCase())
        )
        .map((msg) => ({
          chatId: chat.id,
          chatTitle: chat.title,
          message: msg,
        }))
    );

    res.json({
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(400).json({
        status: "error",
        message: error.message,
        code: 400,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to search messages",
        code: 500,
      });
    }
  }
};

// Get all available assistants
export const getAssistants = async (_req: Request, res: Response) => {
  try {
    res.json(availableAssistants);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch assistants",
      code: 500,
    });
  }
};

// Start a chat with a specific assistant
export const getChatWithAssistant = async (req: Request, res: Response) => {
  try {
    const { assistantId } = req.params;
    const { message } = req.body;

    if (!message) {
      throw new BadRequestError("Message is required");
    }

    const assistant = availableAssistants.find(
      (a) => a.id === parseInt(assistantId, 10)
    );

    if (!assistant) {
      throw new NotFoundError("Assistant not found");
    }

    const newChat: Chat = {
      id: uuidv4(),
      title: `Chat with ${assistant.name}`,
      messages: [
        {
          id: uuidv4(),
          content: message,
          role: "user",
          timestamp: new Date(),
          assistantId: assistant.id,
        },
        {
          id: uuidv4(),
          content: `Hello! I'm ${assistant.name}. How can I help you today?`,
          role: "assistant",
          timestamp: new Date(),
          assistantId: assistant.id,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!storage.addChat(newChat)) {
      throw new Error("Failed to save chat");
    }

    res.status(201).json(newChat);
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(400).json({
        status: "error",
        message: error.message,
        code: 400,
      });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({
        status: "error",
        message: error.message,
        code: 404,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to create chat with assistant",
        code: 500,
      });
    }
  }
};
