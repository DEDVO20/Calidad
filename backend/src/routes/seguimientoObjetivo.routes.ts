import { Router } from "express";
import {
  createSeguimientoObjetivo,
  getSeguimientosObjetivo,
  getSeguimientoObjetivoById,
  updateSeguimientoObjetivo,
} from "../controllers/seguimientoObjetivo.controller";

const router = Router();

// Crear seguimiento de objetivo
router.post("/", createSeguimientoObjetivo);

// Obtener todos los seguimientos de objetivo
router.get("/", getSeguimientosObjetivo);

// Obtener seguimiento de objetivo por ID
router.get("/:id", getSeguimientoObjetivoById);

// Actualizar seguimiento de objetivo
router.put("/:id", updateSeguimientoObjetivo);

export default router;