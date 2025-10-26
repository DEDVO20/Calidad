import { Router } from "express";
import {
  createNoConformidad,
  getNoConformidades,
  getNoConformidadById,
  updateNoConformidad,
  deleteNoConformidad
} from "../controllers/noConformidad.controller.";

const router = Router();

// POST /api/noconformidades
router.post("/", createNoConformidad);

// GET /api/noconformidades
router.get("/", getNoConformidades);

// GET /api/noconformidades/:id
router.get("/:id", getNoConformidadById);

// PUT /api/noconformidades/:id
router.put("/:id", updateNoConformidad);

// DELETE /api/noconformidades/:id
router.delete("/:id", deleteNoConformidad);

export default router;
