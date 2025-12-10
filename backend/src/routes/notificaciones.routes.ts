import { Router } from "express";
import {
    getNotificaciones,
    getNotificacionesNoLeidasCount,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
} from "../controllers/notificaciones.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener notificaciones del usuario
router.get("/", getNotificaciones);

// Contar notificaciones no leídas
router.get("/no-leidas/count", getNotificacionesNoLeidasCount);

// Marcar una notificación como leída
router.patch("/:id/leer", marcarComoLeida);

// Marcar todas las notificaciones como leídas
router.patch("/leer-todas", marcarTodasComoLeidas);

// Eliminar una notificación
router.delete("/:id", eliminarNotificacion);

export default router;
