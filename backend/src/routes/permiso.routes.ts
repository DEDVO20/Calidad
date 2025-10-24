import { Router } from "express";
import {
  createPermiso,
  getPermisos,
  getPermisoById,
  updatePermiso,
  deletePermiso,
} from "../controllers/permiso.controller";

const router = Router();

// CRUD permisos
router.get("/", getPermisos);
router.get("/:id", getPermisoById);
router.post("/", createPermiso);
router.put("/:id", updatePermiso);
router.delete("/:id", deletePermiso);

export default router;
