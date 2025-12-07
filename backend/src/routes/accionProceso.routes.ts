import { Router } from "express";
import {
  createAccionProceso,
  getAccionesProceso,
  getAccionProcesoById,
  updateAccionProceso,
} from "../controllers/accionProceso.controller";

const router = Router();

// POST /api/
router.post("/", createAccionProceso);

// GET /api/
router.get("/", getAccionesProceso);

// GET /api/:id
router.get("/:id", getAccionProcesoById);

// PUT /api/:id
router.put("/:id", updateAccionProceso);


export default router;
