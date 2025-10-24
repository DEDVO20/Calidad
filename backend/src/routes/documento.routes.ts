import { Router } from "express";
import {
  createDocumento,
  getDocumentos,
  getDocumentoById,
  updateDocumento,
  deleteDocumento,
} from "../controllers/documento.controller";

const router = Router();

// CRUD documentos
router.get("/", getDocumentos);
router.get("/:id", getDocumentoById);
router.post("/", createDocumento);
router.put("/:id", updateDocumento);
router.delete("/:id", deleteDocumento);

export default router;
