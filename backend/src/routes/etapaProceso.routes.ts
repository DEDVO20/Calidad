import { Router } from "express";
import {
  createEtapaProceso,
  getEtapasProceso,
  getEtapaProcesoById,
  updateEtapaProceso,
} from "../controllers/etapaProceso.controller";

const router = Router();

// Crear etapa de proceso
router.post("/", createEtapaProceso);

// Obtener todas las etapas de proceso
router.get("/", getEtapasProceso);

// Obtener etapa de proceso por ID
router.get("/:id", getEtapaProcesoById);

// Actualizar etapa de proceso
router.put("/:id", updateEtapaProceso);

export default router;