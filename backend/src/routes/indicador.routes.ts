import { Router } from "express";
import {
  createIndicador,
  getIndicadores,
  getIndicadorById,
  updateIndicador,
} from "../controllers/indicador.controller";

const router = Router();

// Crear indicador
router.post("/", createIndicador);

// Obtener todos los indicadores
router.get("/", getIndicadores);

// Obtener indicador por ID
router.get("/:id", getIndicadorById);

// Actualizar indicador
router.put("/:id", updateIndicador);

export default router;