import { Router } from "express";
import {
  createIndicador,
  getIndicadores,
  getIndicadorById,
  updateIndicador,
} from "../controllers/indicador.controller";

const router = Router();

// POST /api/
router.post("/", createIndicador);

// GET /api/
router.get("/", getIndicadores);

// GET /api/:id
router.get("/:id", getIndicadorById);

// PUT /api/:id
router.put("/:id", updateIndicador);


export default router;
