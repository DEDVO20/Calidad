import { Router } from "express";
import {
  createCapacitacion,
  getCapacitaciones,
  getCapacitacionById,
  updateCapacitacion,
  deleteCapacitacion
} from "../controllers/capacitacion.controller";

const router = Router();

// POST /api/
router.post("/", createCapacitacion);

// GET /api/
router.get("/", getCapacitaciones);

// GET /api/:id
router.get("/:id", getCapacitacionById);

// PUT /api/:id
router.put("/:id", updateCapacitacion);

// DELETE /api/:id
router.delete("/:id", deleteCapacitacion);

export default router;
