import express from "express";
import {
  sendMessage,
  getMessages,
  getAllUsers,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:conversationId", getMessages);
router.get("/users/:userId", getAllUsers);

router.post("/", sendMessage);

export default router;
