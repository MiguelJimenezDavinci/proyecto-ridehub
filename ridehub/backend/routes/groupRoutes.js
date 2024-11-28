// routes/groupRoutes.js
import express from "express";
import { sendMessage } from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/message", authMiddleware, sendMessage);

export default router;
