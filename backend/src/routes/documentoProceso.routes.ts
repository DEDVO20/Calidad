import { Router } from "express";
import {
  createDocumentoProceso,
  getDocumentosProceso,
  getDocumentoProcesoById,
  updateDocumentoProceso,
} from "../controllers/documentoProceso.controller";

const router = Router();

/**
 * @swagger
 * /api/documentos-proceso:
 *   post:
 *     summary: Asociar documento a proceso
 *     tags: [Documentos de Proceso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               procesoId:
 *                 type: string
 *                 format: uuid
 *               documentoId:
 *                 type: string
 *                 format: uuid
 *               tipo:
 *                 type: string
 *                 enum: [entrada, salida, referencia]
 *     responses:
 *       201:
 *         description: Documento asociado
 *       401:
 *         description: No autorizado
 */
router.post("/", createDocumentoProceso);

/**
 * @swagger
 * /api/documentos-proceso:
 *   get:
 *     summary: Listar documentos de procesos
 *     tags: [Documentos de Proceso]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de documentos
 *       401:
 *         description: No autorizado
 */
router.get("/", getDocumentosProceso);

/**
 * @swagger
 * /api/documentos-proceso/{id}:
 *   get:
 *     summary: Obtener documento de proceso por ID
 *     tags: [Documentos de Proceso]
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
 *         description: Detalles
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getDocumentoProcesoById);

/**
 * @swagger
 * /api/documentos-proceso/{id}:
 *   put:
 *     summary: Actualizar documento de proceso
 *     tags: [Documentos de Proceso]
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
 *     responses:
 *       200:
 *         description: Actualizado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateDocumentoProceso);

export default router;