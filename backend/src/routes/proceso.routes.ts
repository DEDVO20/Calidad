import { Router } from "express";
import {
  createProceso,
  getProcesos,
  getProcesoById,
  updateProceso,
} from "../controllers/proceso.controller";

const router = Router();

// Crear proceso
router.post("/", createProceso);

// Obtener todos los procesos
router.get("/", getProcesos);

// Obtener proceso por ID
router.get("/:id", getProcesoById);

// Actualizar proceso
router.put("/:id", updateProceso);

export default router;