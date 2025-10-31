import { Router } from "express";
import multer from "multer";
import {
  createDocumento,
  getDocumentos,
  getDocumentoById,
  updateDocumento,
  deleteDocumento,
} from "../controllers/documento.controller";
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

/**
 * @swagger
 * /api/documentos:
 *   get:
 *     summary: Obtener todos los documentos
 *     tags: [Documentos]
 *     description: Retorna una lista de todos los documentos del sistema de calidad
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre o código
 *       - in: query
 *         name: tipoDocumento
 *         schema:
 *           type: string
 *           enum: [manual, procedimiento, instructivo, formato, registro]
 *         description: Filtrar por tipo de documento
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [borrador, en_revision, aprobado, obsoleto]
 *         description: Filtrar por estado
 *       - in: query
 *         name: visibilidad
 *         schema:
 *           type: string
 *           enum: [publico, privado]
 *         description: Filtrar por visibilidad
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Documentos por página
 *     responses:
 *       200:
 *         description: Lista de documentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Documento'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
router.get("/", authMiddleware, getDocumentos);

/**
 * @swagger
 * /api/documentos/{id}:
 *   get:
 *     summary: Obtener documento por ID
 *     tags: [Documentos]
 *     description: Retorna los detalles de un documento específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del documento
 *     responses:
 *       200:
 *         description: Detalles del documento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documento'
 *       404:
 *         description: Documento no encontrado
 */
router.get("/:id", authMiddleware, getDocumentoById);

/**
 * @swagger
 * /api/documentos:
 *   post:
 *     summary: Crear nuevo documento
 *     tags: [Documentos]
 *     description: Crea un nuevo documento en el sistema de calidad (con archivo opcional y/o contenido HTML)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombreArchivo
 *               - codigoDocumento
 *               - version
 *               - creadoPor
 *             properties:
 *               nombreArchivo:
 *                 type: string
 *                 example: Formato de Solicitud de Equipos
 *               codigoDocumento:
 *                 type: string
 *                 example: FO-GC-001
 *               version:
 *                 type: string
 *                 example: "1.0"
 *               tipoDocumento:
 *                 type: string
 *                 enum: [formato, procedimiento, instructivo, manual, politica, registro, plan]
 *                 example: formato
 *               estado:
 *                 type: string
 *                 enum: [borrador, en_revision, aprobado, obsoleto]
 *                 default: borrador
 *               visibilidad:
 *                 type: string
 *                 enum: [publico, privado]
 *                 default: privado
 *               creadoPor:
 *                 type: string
 *                 format: uuid
 *                 description: ID del usuario que creó el documento
 *               revisadoPor:
 *                 type: string
 *                 format: uuid
 *                 description: ID del usuario que revisó el documento
 *               aprobadoPor:
 *                 type: string
 *                 format: uuid
 *                 description: ID del usuario que aprobó el documento
 *               proximaRevision:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               contenidoHtml:
 *                 type: string
 *                 description: Contenido HTML del documento (desde TipTap)
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: Archivo del documento (opcional si hay contenidoHtml)
 *     responses:
 *       201:
 *         description: Documento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 documento:
 *                   $ref: '#/components/schemas/Documento'
 */
router.post("/", authMiddleware, upload.single("archivo"), createDocumento);

/**
 * @swagger
 * /api/documentos/{id}:
 *   put:
 *     summary: Actualizar documento
 *     tags: [Documentos]
 *     description: Actualiza los datos de un documento existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del documento
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombreArchivo:
 *                 type: string
 *               codigoDocumento:
 *                 type: string
 *               version:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [borrador, en_revision, aprobado, obsoleto]
 *               visibilidad:
 *                 type: string
 *                 enum: [publico, privado]
 *               tipoDocumento:
 *                 type: string
 *               revisadoPor:
 *                 type: string
 *                 format: uuid
 *               aprobadoPor:
 *                 type: string
 *                 format: uuid
 *               proximaRevision:
 *                 type: string
 *                 format: date
 *               contenidoHtml:
 *                 type: string
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: Nuevo archivo (opcional)
 *     responses:
 *       200:
 *         description: Documento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 documento:
 *                   $ref: '#/components/schemas/Documento'
 */
router.put("/:id", authMiddleware, upload.single("archivo"), updateDocumento);

/**
 * @swagger
 * /api/documentos/{id}:
 *   delete:
 *     summary: Eliminar documento
 *     tags: [Documentos]
 *     description: Elimina un documento del sistema y su archivo de Supabase
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del documento
 *     responses:
 *       204:
 *         description: Documento eliminado exitosamente
 *       404:
 *         description: Documento no encontrado
 */
router.delete("/:id", authMiddleware, deleteDocumento);

export default router;
