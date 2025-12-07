import { Router } from "express";
import {
  createAccionCorrectiva,
  getAccionesCorrectivas,
  getAccionCorrectivaById,
  updateAccionCorrectiva,
  cambiarEstadoAccionCorrectiva,
  verificarAccionCorrectiva,
} from "../controllers/accionCorrectiva.controller";

const router = Router();

// POST /api/
router.post("/", createAccionCorrectiva);

// GET /api/
router.get("/", getAccionesCorrectivas);

// GET /api/:id
router.get("/:id", getAccionCorrectivaById);

// PUT /api/:id
router.put("/:id", updateAccionCorrectiva);

// PATCH /api/:id/estado
router.patch("/:id/estado", cambiarEstadoAccionCorrectiva);

// PATCH /api/:id/verificar
router.patch("/:id/verificar", verificarAccionCorrectiva);

