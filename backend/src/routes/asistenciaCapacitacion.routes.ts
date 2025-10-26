import { Router } from "express";
import {
  createAsistencia,
  getAsistencias,
  getAsistenciaById,
  updateAsistencia,
  deleteAsistencia,
} from "../controllers/asistenciaCapacitacion.controller";

const router = Router();

// POST /api/asistencias
router.post("/", createAsistencia);

// GET /api/asistencias
router.get("/", getAsistencias);

// GET /api/asistencias/:id
router.get("/:id", getAsistenciaById);

// PUT /api/asistencias/:id
router.put("/:id", updateAsistencia);

// DELETE /api/asistencias/:id
router.delete("/:id", deleteAsistencia);

export default router;
