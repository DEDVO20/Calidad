import { Router } from "express";
import {
  createEtapaProceso,
  getEtapasProceso,
  getEtapaProcesoById,
  updateEtapaProceso,
} from "../controllers/etapaProceso.controller";

const router = Router();

// POST /api/
router.post("/", createEtapaProceso);

// GET /api/
router.get("/", getEtapasProceso);

// GET /api/:id
router.get("/:id", getEtapaProcesoById);

// PUT /api/:id
router.put("/:id", updateEtapaProceso);


export default router;
