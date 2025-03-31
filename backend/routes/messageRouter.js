import express from "express";

import protect from "../middlewares/authMiddleware.js";
import {
  getConversations,
  sendMessage,
  getMessages,
} from "../contollers/messageControllers.js";

const messageRouter = express.Router();

messageRouter.post("/", protect, sendMessage);
messageRouter.get("/getConversations", protect, getConversations);
messageRouter.get("/:conversationId", protect, getMessages);

export default messageRouter;
