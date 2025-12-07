import { Router } from "express";
import {
  createSeguimientoObjetivo,
  getSeguimientosObjetivo,
  getSeguimientoObjetivoById,
  updateSeguimientoObjetivo,
} from "../controllers/seguimientoObjetivo.controller";

const router = Router();

// POST /api/
router.post("/", createSeguimientoObjetivo);

// GET /api/
router.get("/", getSeguimientosObjetivo);

// GET /api/:id
router.get("/:id", getSeguimientoObjetivoById);

// PUT /api/:id
router.put("/:id", updateSeguimientoObjetivo);

