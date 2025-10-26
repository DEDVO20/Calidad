import { Router } from "express";
import {
  createControlRiesgo,
  getControlesRiesgo,
  getControlRiesgoById,
  updateControlRiesgo,
  deleteControlRiesgo,
} from "../controllers/controlRiesgo.controller";

const router = Router();

/** Rutas para Controles de Riesgo */
router.post("/", createControlRiesgo);
router.get("/", getControlesRiesgo);
router.get("/:id", getControlRiesgoById);
router.put("/:id", updateControlRiesgo);
router.delete("/:id", deleteControlRiesgo);

export default router;