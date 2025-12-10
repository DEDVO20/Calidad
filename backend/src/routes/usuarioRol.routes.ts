import { Router } from "express";
import {
  createUsuarioRol,
  getAllUsuarioRoles,
  getUsuarioRolById,
  getRolesByUsuario,
  getUsuariosByRol,
  getUsuarioRolesByArea,
  updateUsuarioRol,
  deleteUsuarioRol,
  deleteRolesByUsuario,
} from "../controllers/usuarioRol.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// POST /api/
router.post("/", createUsuarioRol);

// GET /api/
router.get("/", getAllUsuarioRoles);

// GET /api/:id
router.get("/:id", getUsuarioRolById);

// GET /api/usuario/:usuarioId
router.get("/usuario/:usuarioId", getRolesByUsuario);

// GET /api/rol/:rolId
router.get("/rol/:rolId", getUsuariosByRol);

// GET /api/area/:areaId
router.get("/area/:areaId", getUsuarioRolesByArea);

// PUT /api/:id
router.put("/:id", updateUsuarioRol);

// DELETE /api/:id
router.delete("/:id", deleteUsuarioRol);

// DELETE /api/usuario/:usuarioId/all
router.delete("/usuario/:usuarioId/all", deleteRolesByUsuario);

export default router;
