import { Router } from "express";
import {
  createInstanciaProceso,
  getInstanciasProceso,
  getInstanciaProcesoById,
  updateInstanciaProceso,
} from "../controllers/instanciaProceso.controller";

const router = Router();

// Crear instancia de proceso
router.post("/", createInstanciaProceso);

// Obtener todas las instancias de proceso
router.get("/", getInstanciasProceso);

// Obtener instancia de proceso por ID
router.get("/:id", getInstanciaProcesoById);

// Actualizar instancia de proceso
router.put("/:id", updateInstanciaProceso);

export default router;