import { Router } from "express";
import {
  createAuditoria,
  getAuditorias,
  getAuditoriaById,
  updateAuditoria,
  deleteAuditoria,
} from "../controllers/auditorias.controller";

const router = Router();

// POST /api/
router.post("/", createAuditoria);

// GET /api/
router.get("/", getAuditorias);

// GET /api/:id
router.get("/:id", getAuditoriaById);

// PUT /api/:id
router.put("/:id", updateAuditoria);

// DELETE /api/:id
router.delete("/:id", deleteAuditoria);

export default router;
