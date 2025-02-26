// src/routes/auth.js
import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  getUsers,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // Asegúrate de tener el middleware de subida de archivos configurado

const router = express.Router();

// Rutas de autenticación
router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);

// Rutas protegidas con autenticación
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single("photo"), updateProfile); // Cargar imagen con 'upload'
router.delete("/profile", authMiddleware, deleteAccount);

// Exportar el router
export default router;
