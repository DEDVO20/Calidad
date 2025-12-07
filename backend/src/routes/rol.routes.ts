import { Router } from "express";
import {
  createRol,
  getRoles,
  getRolById,
  updateRol,
  deleteRol,
  addPermisosToRol,
  removePermisosFromRol,
} from "../controllers/rol.controller";

const router = Router();

// GET /api/
router.get("/", getRoles);

// GET /api/:id
router.get("/:id", getRolById);

// POST /api/
router.post("/", createRol);

// PUT /api/:id
router.put("/:id", updateRol);

// DELETE /api/:id
router.delete("/:id", deleteRol);

// POST /api/:id/permisos
router.post("/:id/permisos", addPermisosToRol);

// DELETE /api/:id/permisos
router.delete("/:id/permisos", removePermisosFromRol);

export default router;
