import { Router } from "express";
import {
  createHallazgoAuditoria,
  getHallazgosAuditoria,
  getHallazgoAuditoriaById,
  updateHallazgoAuditoria,
  deleteHallazgoAuditoria,
} from "../controllers/hallazgoAuditoria.controller";

const router = Router();

/** Rutas para Hallazgos de Auditoría */
router.post("/", createHallazgoAuditoria);
router.get("/", getHallazgosAuditoria);
router.get("/:id", getHallazgoAuditoriaById);
router.put("/:id", updateHallazgoAuditoria);
router.delete("/:id", deleteHallazgoAuditoria);

export default router;