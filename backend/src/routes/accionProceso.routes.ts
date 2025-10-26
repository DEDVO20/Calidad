import { Router } from "express";
import {
  createAccionProceso,
  getAccionesProceso,
  getAccionProcesoById,
  updateAccionProceso,
} from "../controllers/accionProceso.controller";

const router = Router();

// Crear acción de proceso
router.post("/", createAccionProceso);

// Obtener todas las acciones de proceso
router.get("/", getAccionesProceso);

// Obtener acción de proceso por ID
router.get("/:id", getAccionProcesoById);

// Actualizar acción de proceso
router.put("/:id", updateAccionProceso);

export default router;