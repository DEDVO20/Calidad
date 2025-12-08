import { Router } from "express";
import {
  createAsignacion,
  getAllAsignaciones,
  getAsignacionById,
  getAsignacionesByArea,
  getAsignacionesByUsuario,
  updateAsignacion,
  deleteAsignacion,
  deleteAsignacionesByArea,
  deleteAsignacionesByUsuario,
} from "../controllers/asignacion.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// POST /api/
router.post("/", createAsignacion);

// GET /api/
router.get("/", getAllAsignaciones);

// GET /api/:id
router.get("/:id", getAsignacionById);

// GET /api/area/:areaId
router.get("/area/:areaId", getAsignacionesByArea);

// GET /api/usuario/:usuarioId
router.get("/usuario/:usuarioId", getAsignacionesByUsuario);

// PUT /api/:id
router.put("/:id", updateAsignacion);

// DELETE /api/:id
router.delete("/:id", deleteAsignacion);

// DELETE /api/area/:areaId/all
router.delete("/area/:areaId/all", deleteAsignacionesByArea);

// DELETE /api/usuario/:usuarioId/all
router.delete("/usuario/:usuarioId/all", deleteAsignacionesByUsuario);

export default router;
