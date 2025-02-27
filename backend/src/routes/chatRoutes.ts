import { Router } from "express";
import {
  createChat,
  sendMessage,
  getChats,
  getChat,
  searchMessages,
  getAssistants,
  getChatWithAssistant,
} from "../controllers/chatController";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// Assistant routes
router.get("/assistants", asyncHandler(getAssistants));
router.post("/chat/assistant/:assistantId", asyncHandler(getChatWithAssistant));

// Chat routes with async error handling
router.post("/chat", asyncHandler(createChat));
router.post("/chat/message", asyncHandler(sendMessage));
router.get("/chats", asyncHandler(getChats));
router.get("/chat/:id", asyncHandler(getChat));
router.get("/search", asyncHandler(searchMessages));

export default router;
