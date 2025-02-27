import request from "supertest";
import express from "express";
import cors from "cors";
import chatRoutes from "../routes/chatRoutes";
import { errorHandler } from "../middleware/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", chatRoutes);
app.use(errorHandler);

describe("Chat API", () => {
  let chatId: string;

  describe("POST /api/chat", () => {
    it("should create a new chat", async () => {
      const res = await request(app)
        .post("/api/chat")
        .send({ message: "Hello, AI!" });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.messages).toHaveLength(2);
      expect(res.body.messages[0].content).toBe("Hello, AI!");
      expect(res.body.messages[0].role).toBe("user");
      expect(res.body.messages[1].role).toBe("assistant");

      chatId = res.body.id;
    });

    it("should return 400 if message is empty", async () => {
      const res = await request(app).post("/api/chat").send({ message: "" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Message is required");
    });
  });

  describe("POST /api/chat/message", () => {
    it("should add a message to existing chat", async () => {
      const res = await request(app).post("/api/chat/message").send({
        chatId,
        message: "How are you?",
      });

      expect(res.status).toBe(200);
      expect(res.body.messages).toHaveLength(4);
      expect(res.body.messages[2].content).toBe("How are you?");
      expect(res.body.messages[2].role).toBe("user");
      expect(res.body.messages[3].role).toBe("assistant");
    });

    it("should return 404 for non-existent chat", async () => {
      const res = await request(app).post("/api/chat/message").send({
        chatId: "non-existent-id",
        message: "Hello",
      });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Chat not found");
    });
  });

  describe("GET /api/chats", () => {
    it("should return all chats", async () => {
      const res = await request(app).get("/api/chats");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/chat/:id", () => {
    it("should return a specific chat", async () => {
      const res = await request(app).get(`/api/chat/${chatId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(chatId);
    });

    it("should return 404 for non-existent chat", async () => {
      const res = await request(app).get("/api/chat/non-existent-id");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Chat not found");
    });
  });

  describe("GET /api/search", () => {
    it("should search messages across chats", async () => {
      const res = await request(app)
        .get("/api/search")
        .query({ query: "Hello" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("results");
      expect(Array.isArray(res.body.results)).toBe(true);
      expect(res.body.results.length).toBeGreaterThan(0);
    });

    it("should return 400 for empty search query", async () => {
      const res = await request(app).get("/api/search").query({ query: "" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Search query is required");
    });
  });
});
