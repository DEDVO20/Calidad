import { Router } from "express";
import {
  createDocumentoProceso,
  getDocumentosProceso,
  getDocumentoProcesoById,
  updateDocumentoProceso,
} from "../controllers/documentoProceso.controller";

const router = Router();

// Crear documento de proceso
router.post("/", createDocumentoProceso);

// Obtener todos los documentos de proceso
router.get("/", getDocumentosProceso);

// Obtener documento de proceso por ID
router.get("/:id", getDocumentoProcesoById);

// Actualizar documento de proceso
router.put("/:id", updateDocumentoProceso);

export default router;