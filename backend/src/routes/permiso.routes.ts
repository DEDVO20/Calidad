import { Router } from "express";
import {
  createPermiso,
  getPermisos,
  getPermisoById,
  updatePermiso,
  deletePermiso,
} from "../controllers/permiso.controller";

const router = Router();

// GET /api/
router.get("/", getPermisos);

// GET /api/:id
router.get("/:id", getPermisoById);

// POST /api/
router.post("/", createPermiso);

// PUT /api/:id
router.put("/:id", updatePermiso);

// DELETE /api/:id
router.delete("/:id", deletePermiso);

export default router;
