import { Router } from "express";
import {
  createRiesgo,
  getRiesgos,
  getRiesgoById,
  updateRiesgo,
  deleteRiesgo,
} from "../controllers/riesgo.controller";

const router = Router();

/** Rutas para Riesgos */
router.post("/", createRiesgo);
router.get("/", getRiesgos);
router.get("/:id", getRiesgoById);
router.put("/:id", updateRiesgo);
router.delete("/:id", deleteRiesgo);

export default router;