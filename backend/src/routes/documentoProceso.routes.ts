import { Router } from "express";
import {
  createDocumentoProceso,
  getDocumentosProceso,
  getDocumentoProcesoById,
  updateDocumentoProceso,
} from "../controllers/documentoProceso.controller";

const router = Router();

// POST /api/
router.post("/", createDocumentoProceso);

// GET /api/
router.get("/", getDocumentosProceso);

// GET /api/:id
router.get("/:id", getDocumentoProcesoById);

// PUT /api/:id
router.put("/:id", updateDocumentoProceso);


export default router;
