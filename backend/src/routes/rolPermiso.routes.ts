import { Router } from "express";
import {
  createRolPermiso,
  getRolPermisos,
  getRolPermisoById,
  deleteRolPermiso,
} from "../controllers/rolPermiso.controller";

const router = Router();

router.get("/", getRolPermisos);
router.get("/:id", getRolPermisoById);
router.post("/", createRolPermiso);
router.delete("/:id", deleteRolPermiso);

export default router;
