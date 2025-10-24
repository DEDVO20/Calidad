import { Router } from "express";
import {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuario.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

export default router;
