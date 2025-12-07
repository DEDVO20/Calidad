import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  bulkImportUsuarios,
} from "../controllers/usuario.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  uploadProfile,
  handleMulterError,
} from "../middlewares/upload.middleware";

const router = Router();

// Configuración de multer para importación masiva (memoria, máx 5MB)
const uploadBulk = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Middleware condicional para multer (manejo de foto de perfil)
const conditionalMulter = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    // Si es multipart, usar multer para foto de perfil
    return uploadProfile.single("foto")(req, res, next);
  }
  // Si es JSON, pasar directo
  next();
};

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// GET /api/usuarios - Obtener todos los usuarios (con paginación y filtros)
router.get("/", getUsuarios);

// GET /api/usuarios/:id - Obtener un usuario por su ID
router.get("/:id", getUsuarioById);

// POST /api/usuarios - Crear un nuevo usuario
router.post("/", createUsuario);

// PUT /api/usuarios/:id - Actualizar información completa de un usuario
router.put("/:id", conditionalMulter, handleMulterError, updateUsuario);

// PATCH /api/usuarios/:id - Actualizar información parcial de un usuario (incluyendo foto)
router.patch("/:id", conditionalMulter, handleMulterError, updateUsuario);

// DELETE /api/usuarios/:id - Eliminar un usuario (soft delete si aplica, o físico)
router.delete("/:id", deleteUsuario);

// POST /api/usuarios/bulk-import - Importación masiva de usuarios desde archivo Excel/CSV
router.post("/bulk-import", uploadBulk.single('file'), bulkImportUsuarios);

export default router;

