import { Router } from "express";
import {
  createConfiguracion,
  getConfiguraciones,
  getConfiguracionByClave,
  updateConfiguracion,
  deleteConfiguracion,
} from "../controllers/configuracion.controller";

const router = Router();

// GET /api/
router.get("/", getConfiguraciones);

// GET /api/:clave
router.get("/:clave", getConfiguracionByClave);

// POST /api/
router.post("/", createConfiguracion);

// PUT /api/:clave
router.put("/:clave", updateConfiguracion);

// DELETE /api/:clave
router.delete("/:clave", deleteConfiguracion);

export default router;
