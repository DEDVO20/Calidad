import { Router } from "express";
import {
  createProceso,
  getProcesos,
  getProcesoById,
  updateProceso,
} from "../controllers/proceso.controller";

const router = Router();

// POST /api/
router.post("/", createProceso);

// GET /api/
router.get("/", getProcesos);

// GET /api/:id
router.get("/:id", getProcesoById);

// PUT /api/:id
router.put("/:id", updateProceso);

