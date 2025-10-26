import { Router } from "express";
import {
  createAuditoria,
  getAuditorias,
  getAuditoriaById,
  updateAuditoria,
  deleteAuditoria,
} from "../controllers/auditorias.controller";

const router = Router();

router.post("/", createAuditoria);
router.get("/", getAuditorias);
router.get("/:id", getAuditoriaById);
router.put("/:id", updateAuditoria);
router.delete("/:id", deleteAuditoria);

export default router;
