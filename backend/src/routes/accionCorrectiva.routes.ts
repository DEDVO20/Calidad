import { Router } from "express";
import {
  createAccionCorrectiva,
  getAccionesCorrectivas,
  getAccionCorrectivaById,
  updateAccionCorrectiva,
} from "../controllers/accionCorrectiva.controller";

const router = Router();

// Crear acción correctiva
router.post("/", createAccionCorrectiva);

// Obtener todas las acciones correctivas
router.get("/", getAccionesCorrectivas);

// Obtener acción correctiva por ID
router.get("/:id", getAccionCorrectivaById);

// Actualizar acción correctiva
router.put("/:id", updateAccionCorrectiva);

export default router;