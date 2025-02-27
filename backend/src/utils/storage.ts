import fs from "fs";
import path from "path";
import { Chat, Message } from "../types/chat";

const STORAGE_DIR = path.join(__dirname, "../../data");
const CHATS_FILE = path.join(STORAGE_DIR, "chats.json");

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Initialize empty chats file if it doesn't exist
if (!fs.existsSync(CHATS_FILE)) {
  fs.writeFileSync(CHATS_FILE, JSON.stringify([]));
}

export interface StoredChat
  extends Omit<Chat, "createdAt" | "updatedAt" | "messages"> {
  createdAt: string;
  updatedAt: string;
  messages: (Omit<Message, "timestamp"> & { timestamp: string })[];
}

export const storage = {
  getChats: (): Chat[] => {
    try {
      const data = fs.readFileSync(CHATS_FILE, "utf-8");
      const storedChats = JSON.parse(data) as StoredChat[];

      return storedChats.map((chat) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    } catch (error) {
      console.error("Error reading chats:", error);
      return [];
    }
  },

  saveChats: (chats: Chat[]) => {
    try {
      const storedChats: StoredChat[] = chats.map((chat) => ({
        ...chat,
        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString(),
        messages: chat.messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        })),
      }));

      fs.writeFileSync(CHATS_FILE, JSON.stringify(storedChats, null, 2));
      return true;
    } catch (error) {
      console.error("Error saving chats:", error);
      return false;
    }
  },

  addChat: (chat: Chat) => {
    const chats = storage.getChats();
    chats.push(chat);
    return storage.saveChats(chats);
  },

  updateChat: (chatId: string, updatedChat: Chat) => {
    const chats = storage.getChats();
    const index = chats.findIndex((c) => c.id === chatId);
    if (index === -1) return false;

    chats[index] = updatedChat;
    return storage.saveChats(chats);
  },

  getChat: (chatId: string) => {
    const chats = storage.getChats();
    return chats.find((c) => c.id === chatId);
  },
};
