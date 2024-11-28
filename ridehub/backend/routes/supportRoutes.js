import express from "express";
import {
  createSupportRequest,
  getUserSupportRequests,
} from "../controllers/supportController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Definir las rutas
router.post("/", authMiddleware, createSupportRequest); // Crear solicitud de soporte
router.get("/", authMiddleware, getUserSupportRequests); // Obtener todas las solicitudes de soporte del usuario

// Exportar el router
export default router;
