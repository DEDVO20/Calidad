import { Router } from "express";
import multer from "multer";
import {
  createDocumento,
  getDocumentos,
  getDocumentoById,
  updateDocumento,
  deleteDocumento,
} from "../controllers/documento.controller";
import {
  getDocumentosPendientes,
  aprobarDocumento,
  rechazarDocumento,
  getMisAprobaciones,
} from "../controllers/aprobaciones.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Configurar multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Tipos de archivo permitidos
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Tipo de archivo no permitido. Solo PDF, Word, Excel e imágenes.",
        ),
      );
    }
  },
});

// GET /api/
router.get("/", authMiddleware, getDocumentos);

// GET /api/:id
router.get("/:id", authMiddleware, getDocumentoById);

// POST /api/
router.post("/", authMiddleware, upload.single("archivo"), createDocumento);

// PUT /api/:id
router.put("/:id", authMiddleware, upload.single("archivo"), updateDocumento);

// DELETE /api/:id
router.delete("/:id", authMiddleware, deleteDocumento);

// Rutas específicas para aprobaciones
router.get("/pendientes/lista", authMiddleware, getDocumentosPendientes);
router.get("/mis-aprobaciones/resumen", authMiddleware, getMisAprobaciones);
router.post("/:id/aprobar", authMiddleware, aprobarDocumento);
router.post("/:id/rechazar", authMiddleware, rechazarDocumento);

export default router;
