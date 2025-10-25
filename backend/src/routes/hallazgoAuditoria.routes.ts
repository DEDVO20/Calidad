import { Router } from "express";
import {
  createhallazgoAuditoria,
  gethallazgosAuditoria,
  gethallazgoAuditoriaById,
  updatehallazgoAuditoria,
  deletehallazgoAuditoria,
} from "../controllers/HallazgoAuditoria.Controller";

const router = Router();

/** Rutas para Hallazgos de Auditoría */
router.post("/", createhallazgoAuditoria);
router.get("/", gethallazgosAuditoria);
router.get("/:id", gethallazgoAuditoriaById);
router.put("/:id", updatehallazgoAuditoria);
router.delete("/:id", deletehallazgoAuditoria);

export default router;
