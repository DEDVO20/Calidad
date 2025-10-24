import { Router } from "express";
import {
  createConfiguracion,
  getConfiguraciones,
  getConfiguracionByClave,
  updateConfiguracion,
  deleteConfiguracion,
} from "../controllers/configuracion.controller";

const router = Router();

// CRUD Configuración
router.get("/", getConfiguraciones);
router.get("/:clave", getConfiguracionByClave);
router.post("/", createConfiguracion);
router.put("/:clave", updateConfiguracion);
router.delete("/:clave", deleteConfiguracion);

export default router;
