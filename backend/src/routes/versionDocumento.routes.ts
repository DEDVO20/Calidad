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
} from "../controllers/versionDocumento.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

/**
 * @swagger
 * /api/versiones-documento:
 *   post:
 *     summary: Crear una nueva versión de documento
 *     tags: [VersionesDocumento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentoId
 *               - numeroVersion
 *               - subidoPor
 *             properties:
 *               documentoId:
 *                 type: string
 *                 format: uuid
 *               numeroVersion:
 *                 type: integer
 *               subidoPor:
 *                 type: string
 *                 format: uuid
 *               cambios:
 *                 type: string
 *               rutaArchivo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Versión de documento creada exitosamente
 *       500:
 *         description: Error al crear la versión del documento
 */
router.post("/", createVersionDocumento);

/**
 * @swagger
 * /api/versiones-documento:
 *   get:
 *     summary: Obtener todas las versiones de documentos
 *     tags: [VersionesDocumento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de versiones de documentos
 *       500:
 *         description: Error al obtener las versiones de documentos
 */
router.get("/", getAllVersionesDocumento);

/**
 * @swagger
 * /api/versiones-documento/{id}:
 *   get:
 *     summary: Obtener una versión de documento por ID
 *     tags: [VersionesDocumento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Versión de documento encontrada
 *       404:
 *         description: Versión del documento no encontrada
 *       500:
 *         description: Error al obtener la versión del documento
 */
router.get("/:id", getVersionDocumentoById);

/**
 * @swagger
 * /api/versiones-documento/documento/{documentoId}:
 *   get:
 *     summary: Obtener todas las versiones de un documento específico
 *     tags: [VersionesDocumento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de versiones del documento ordenadas por número de versión descendente
 *       500:
 *         description: Error al obtener las versiones del documento
 */
router.get("/documento/:documentoId", getVersionesByDocumento);

/**
 * @swagger
 * /api/versiones-documento/documento/{documentoId}/ultima:
 *   get:
 *     summary: Obtener la última versión de un documento
 *     tags: [VersionesDocumento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Última versión del documento
 *       404:
 *         description: No se encontraron versiones para este documento
 *       500:
 *         description: Error al obtener la última versión del documento
 */
router.get("/documento/:documentoId/ultima", getUltimaVersionByDocumento);

/**
 * @swagger
 * /api/versiones-documento/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener todas las versiones subidas por un usuario
 *     tags: [VersionesDocumento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de versiones subidas por el usuario ordenadas por fecha descendente
 *       500:
 *         description: Error al obtener las versiones subidas por el usuario
 */
router.get("/usuario/:usuarioId", getVersionesByUsuario);

/**
 * @swagger
 * /api/versiones-documento/{id}:
 *   put:
 *     summary: Actualizar una versión de documento
 *     tags: [VersionesDocumento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentoId:
 *                 type: string
 *                 format: uuid
 *               numeroVersion:
 *                 type: integer
 *               subidoPor:
 *                 type: string
 *                 format: uuid
 *               cambios:
 *                 type: string
 *               rutaArchivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Versión de documento actualizada exitosamente
 *       404:
 *         description: Versión del documento no encontrada
 *       500:
 *         description: Error al actualizar la versión del documento
 */
router.put("/:id", updateVersionDocumento);

/**
 * @swagger
 * /api/versiones-documento/{id}:
 *   delete:
 *     summary: Eliminar una versión de documento
 *     tags: [VersionesDocumento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Versión de documento eliminada exitosamente
 *       404:
 *         description: Versión del documento no encontrada
 *       500:
 *         description: Error al eliminar la versión del documento
 */
router.delete("/:id", deleteVersionDocumento);

export default router;
