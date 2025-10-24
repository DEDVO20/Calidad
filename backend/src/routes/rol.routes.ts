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

// CRUD roles
router.get("/", getRoles);
router.get("/:id", getRolById);
router.post("/", createRol);
router.put("/:id", updateRol);
router.delete("/:id", deleteRol);

// Opcional: gestión de permisos del rol
router.post("/:id/permisos", addPermisosToRol);       // agregar varios permisos
router.delete("/:id/permisos", removePermisosFromRol); // quitar varios permisos

export default router;
