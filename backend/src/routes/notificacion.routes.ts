import { Router } from "express";
import {
  createNotificacion,
  getNotificaciones,
  getNotificacionById,
  marcarComoLeida,
  deleteNotificacion,
} from "../controllers/notificacion.controller";

const router = Router();

// POST /api/notificaciones
router.post("/", createNotificacion);

// GET /api/notificaciones
router.get("/", getNotificaciones);

// GET /api/notificaciones/:id
router.get("/:id", getNotificacionById);

// PUT /api/notificaciones/:id/leida
router.put("/:id/leida", marcarComoLeida);

// DELETE /api/notificaciones/:id
router.delete("/:id", deleteNotificacion);

export default router;
