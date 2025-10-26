import { Router } from "express";
import {
  createCapacitacion,
  getCapacitaciones,
  getCapacitacionById,
  updateCapacitacion,
  deleteCapacitacion
} from "../controllers/capacitacion.controller";

const router = Router();

// POST /api/capacitaciones
router.post("/", createCapacitacion);

// GET /api/capacitaciones
router.get("/", getCapacitaciones);

// GET /api/capacitaciones/:id
router.get("/:id", getCapacitacionById);

// PUT /api/capacitaciones/:id
router.put("/:id", updateCapacitacion);

// DELETE /api/capacitaciones/:id
router.delete("/:id", deleteCapacitacion);

export default router;
