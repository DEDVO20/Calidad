import { Router } from "express";
import {
  createObjetivoCalidad,
  getObjetivosCalidad,
  getObjetivoCalidadById,
  updateObjetivoCalidad,
} from "../controllers/objetivoCalidad.controller";

const router = Router();

// Crear objetivo de calidad
router.post("/", createObjetivoCalidad);

// Obtener todos los objetivos de calidad
router.get("/", getObjetivosCalidad);

// Obtener objetivo de calidad por ID
router.get("/:id", getObjetivoCalidadById);

// Actualizar objetivo de calidad
router.put("/:id", updateObjetivoCalidad);

export default router;