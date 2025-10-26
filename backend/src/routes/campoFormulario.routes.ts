import { Router } from "express";
import {
  createCampoFormulario,
  getCamposFormulario,
  getCampoFormularioById,
  updateCampoFormulario,
} from "../controllers/campoFormulario.controller";

const router = Router();

// Crear campo de formulario
router.post("/", createCampoFormulario);

// Obtener todos los campos de formulario
router.get("/", getCamposFormulario);

// Obtener campo de formulario por ID
router.get("/:id", getCampoFormularioById);

// Actualizar campo de formulario
router.put("/:id", updateCampoFormulario);

export default router;