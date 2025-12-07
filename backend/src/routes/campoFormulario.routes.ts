import { Router } from "express";
import {
  createCampoFormulario,
  getCamposFormulario,
  getCampoFormularioById,
  updateCampoFormulario,
} from "../controllers/campoFormulario.controller";

const router = Router();

// POST /api/
router.post("/", createCampoFormulario);

// GET /api/
router.get("/", getCamposFormulario);

// GET /api/:id
router.get("/:id", getCampoFormularioById);

// PUT /api/:id
router.put("/:id", updateCampoFormulario);

