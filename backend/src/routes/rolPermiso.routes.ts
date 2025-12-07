import { Router } from "express";
import {
  createRolPermiso,
  getRolPermisos,
  getRolPermisoById,
  deleteRolPermiso,
} from "../controllers/rolPermiso.controller";

const router = Router();

// GET /api/
router.get("/", getRolPermisos);

// GET /api/:id
router.get("/:id", getRolPermisoById);

// POST /api/
router.post("/", createRolPermiso);

// DELETE /api/:id
router.delete("/:id", deleteRolPermiso);

export default router;
