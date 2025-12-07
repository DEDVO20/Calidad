import { Router } from "express";
import {
  createObjetivoCalidad,
  getObjetivosCalidad,
  getObjetivoCalidadById,
  updateObjetivoCalidad,
} from "../controllers/objetivoCalidad.controller";

const router = Router();

// POST /api/
router.post("/", createObjetivoCalidad);

// GET /api/
router.get("/", getObjetivosCalidad);

// GET /api/:id
router.get("/:id", getObjetivoCalidadById);

// PUT /api/:id
router.put("/:id", updateObjetivoCalidad);

