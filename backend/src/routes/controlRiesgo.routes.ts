import { Router } from "express";
import {
  createControlRiesgo,
  getControlesRiesgo,
  getControlRiesgoById,
  updateControlRiesgo,
  deleteControlRiesgo,
} from "../controllers/controlRiesgo.controller";

const router = Router();

// POST /api/
router.post("/", createControlRiesgo);

// GET /api/
router.get("/", getControlesRiesgo);

// GET /api/:id
router.get("/:id", getControlRiesgoById);

// PUT /api/:id
router.put("/:id", updateControlRiesgo);

// DELETE /api/:id
router.delete("/:id", deleteControlRiesgo);


export default router;
