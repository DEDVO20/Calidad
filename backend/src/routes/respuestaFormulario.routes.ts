import { Router } from "express";
import {
  createRespuestaFormulario,
  getRespuestaFormularioById,
  updateRespuestaFormulario,
  deleteRespuestaFormulario,
  getRespuestasByInstancia,
  getAllRespuestasFormulario,
} from "../controllers/respuestaFormulario.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// POST /api/
router.post("/", createRespuestaFormulario);

// GET /api/
router.get("/", getAllRespuestasFormulario);

// GET /api/:id
router.get("/:id", getRespuestaFormularioById);

// GET /api/instancia/:instanciaId
router.get("/instancia/:instanciaId", getRespuestasByInstancia);

// PUT /api/:id
router.put("/:id", updateRespuestaFormulario);

// DELETE /api/:id
router.delete("/:id", deleteRespuestaFormulario);

export default router;
