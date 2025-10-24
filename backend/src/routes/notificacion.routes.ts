import { Router } from "express";
import {
  createNotificacion,
  getNotificaciones,
  getNotificacionById,
  updateNotificacion,
} from "../controllers/notificacion.controller";

const router = Router();

/**
 * Rutas de Notificaciones
 * POST   /api/notificaciones          → crear
 * GET    /api/notificaciones          → listar (query: ?usuario_id=...)
 * GET    /api/notificaciones/:id      → traer por id
 * PUT    /api/notificaciones/:id      → actualizar
 */
router.post("/", createNotificacion);
router.get("/", getNotificaciones);
router.get("/:id", getNotificacionById);
router.put("/:id", updateNotificacion);

export default router;
