import { Router, Request, Response, NextFunction } from "express";
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

// Middleware condicional para multer
const conditionalMulter = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    // Si es multipart, usar multer
    return uploadProfile.single("foto")(req, res, next);
  }
  // Si es JSON, pasar directo
  next();
};

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// GET /api/usuarios - Obtener todos los usuarios
router.get("/", getUsuarios);

// GET /api/:id
router.get("/:id", getUsuarioById);

// POST /api/
router.post("/", createUsuario);

// PUT /api/:id
router.put("/:id", conditionalMulter, handleMulterError, updateUsuario);

// PATCH /api/:id
router.patch("/:id", conditionalMulter, handleMulterError, updateUsuario);

// DELETE /api/:id
router.delete("/:id", deleteUsuario);

// POST /api/bulk-import
router.post("/bulk-import", uploadBulk.single('file'), bulkImportUsuarios);

export default router;

