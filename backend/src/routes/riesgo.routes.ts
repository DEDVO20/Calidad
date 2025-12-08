import { Router } from "express";
import {
  createRiesgo,
  getRiesgos,
  getRiesgoById,
  updateRiesgo,
  deleteRiesgo,
} from "../controllers/riesgo.controller";
import { optionalAuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware opcional de autenticación a todas las rutas
router.use(optionalAuthMiddleware);

// POST /api/
router.post("/", createRiesgo);

// GET /api/
router.get("/", getRiesgos);

// GET /api/:id
router.get("/:id", getRiesgoById);

// PUT /api/:id
router.put("/:id", updateRiesgo);

// DELETE /api/:id
router.delete("/:id", deleteRiesgo);


export default router;
