import { Router } from "express";
import {
  createDocumento,
  getDocumentos,
  getDocumentoById,
  updateDocumento,
  deleteDocumento,
} from "../controllers/documento.controller";

const router = Router();

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
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [manual, procedimiento, instructivo, formato, registro]
 *         description: Filtrar por tipo de documento
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [borrador, revision, aprobado, obsoleto]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de documentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Documento'
 */
router.get("/", getDocumentos);

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
 *           type: integer
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
router.get("/:id", getDocumentoById);

/**
 * @swagger
 * /api/documentos:
 *   post:
 *     summary: Crear nuevo documento
 *     tags: [Documentos]
 *     description: Crea un nuevo documento en el sistema de calidad
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - nombre
 *               - tipo
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: DOC-001
 *               nombre:
 *                 type: string
 *                 example: Manual de Calidad
 *               tipo:
 *                 type: string
 *                 enum: [manual, procedimiento, instructivo, formato, registro]
 *                 example: manual
 *               version:
 *                 type: string
 *                 example: "1.0"
 *               estado:
 *                 type: string
 *                 enum: [borrador, revision, aprobado, obsoleto]
 *                 default: borrador
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: Archivo del documento
 *     responses:
 *       201:
 *         description: Documento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documento'
 */
router.post("/", createDocumento);

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
 *           type: integer
 *         description: ID del documento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [borrador, revision, aprobado, obsoleto]
 *               version:
 *                 type: string
 *     responses:
 *       200:
 *         description: Documento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documento'
 */
router.put("/:id", updateDocumento);

/**
 * @swagger
 * /api/documentos/{id}:
 *   delete:
 *     summary: Eliminar documento
 *     tags: [Documentos]
 *     description: Elimina un documento del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del documento
 *     responses:
 *       200:
 *         description: Documento eliminado exitosamente
 *       404:
 *         description: Documento no encontrado
 */
router.delete("/:id", deleteDocumento);

export default router;
