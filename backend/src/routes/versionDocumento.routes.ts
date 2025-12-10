import { Router } from "express";
import {
  createVersionDocumento,
  getAllVersionesDocumento,
  getVersionDocumentoById,
  getVersionesByDocumento,
  getUltimaVersionByDocumento,
  getVersionesByUsuario,
  updateVersionDocumento,
  deleteVersionDocumento,
  restoreVersion,
  compareVersions,
  downloadVersion,
} from "../controllers/versionDocumento.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// POST /api/
router.post("/", createVersionDocumento);

// GET /api/
router.get("/", getAllVersionesDocumento);

// GET /api/:id
router.get("/:id", getVersionDocumentoById);

// GET /api/documento/:documentoId
router.get("/documento/:documentoId", getVersionesByDocumento);

// GET /api/documento/:documentoId/ultima
router.get("/documento/:documentoId/ultima", getUltimaVersionByDocumento);

// GET /api/usuario/:usuarioId
router.get("/usuario/:usuarioId", getVersionesByUsuario);

// PUT /api/:id
router.put("/:id", updateVersionDocumento);

// DELETE /api/:id
router.delete("/:id", deleteVersionDocumento);

// POST /api/:id/restore
router.post("/:id/restore", restoreVersion);

// GET /api/compare/:id1/:id2
router.get("/compare/:id1/:id2", compareVersions);

// GET /api/:id/download
router.get("/:id/download", downloadVersion);

export default router;
