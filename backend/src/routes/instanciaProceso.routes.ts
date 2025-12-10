import { Router } from "express";
import {
  createInstanciaProceso,
  getInstanciasProceso,
  getInstanciaProcesoById,
  updateInstanciaProceso,
} from "../controllers/instanciaProceso.controller";

const router = Router();

// POST /api/
router.post("/", createInstanciaProceso);

// GET /api/
router.get("/", getInstanciasProceso);

// GET /api/:id
router.get("/:id", getInstanciaProcesoById);

// PUT /api/:id
router.put("/:id", updateInstanciaProceso);


export default router;
