import { Router } from "express";
import {
  createAsistencia,
  getAsistencias,
  getAsistenciaById,
  updateAsistencia,
  deleteAsistencia,
} from "../controllers/asistenciaCapacitacion.controller";

const router = Router();

// POST /api/
router.post("/", createAsistencia);

// GET /api/
router.get("/", getAsistencias);

// GET /api/:id
router.get("/:id", getAsistenciaById);

// PUT /api/:id
router.put("/:id", updateAsistencia);

// DELETE /api/:id
router.delete("/:id", deleteAsistencia);

export default router;
