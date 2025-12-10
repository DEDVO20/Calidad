import { Router } from "express";
import {
  createhallazgoAuditoria,
  gethallazgosAuditoria,
  gethallazgoAuditoriaById,
  updatehallazgoAuditoria,
  deletehallazgoAuditoria,
} from "../controllers/hallazgoAuditoria.controller";

const router = Router();

// POST /api/
router.post("/", createhallazgoAuditoria);

// GET /api/
router.get("/", gethallazgosAuditoria);

// GET /api/:id
router.get("/:id", gethallazgoAuditoriaById);

// PUT /api/:id
router.put("/:id", updatehallazgoAuditoria);

// DELETE /api/:id
router.delete("/:id", deletehallazgoAuditoria);

export default router;
