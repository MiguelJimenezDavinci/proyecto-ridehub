import express from "express";
import {
  getUserChats,
  createChat,
  getChatMessages,
} from "../controllers/conversationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user/:id", authMiddleware, getUserChats); // Obtener todos los chats del usuario
router.get("/:chatId", authMiddleware, getChatMessages); // Obtener todos los chats del usuario
router.post("/", createChat); // Crear un nuevo chat

export default router;
