import { Router } from "express";
import {
  createAuditoria,
  getAuditorias,
  getAuditoriaById,
  updateAuditoria,
  deleteAuditoria,
} from "../controllers/auditorias.controller";

const router = Router();

/**
 * @swagger
 * /api/auditorias:
 *   post:
 *     summary: Crear auditoría de calidad
 *     tags: [Auditorías]
 *     description: Programa una nueva auditoría de calidad según ISO 9001 Cláusula 9.2
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: AUD-2024-001
 *                 description: Código único de la auditoría
 *               tipo:
 *                 type: string
 *                 enum: [interna, externa, certificacion, seguimiento]
 *                 example: interna
 *               objetivo:
 *                 type: string
 *                 example: Verificar cumplimiento de requisitos ISO 9001:2015
 *               alcance:
 *                 type: string
 *                 example: Procesos de producción y control de calidad
 *               normaReferencia:
 *                 type: string
 *                 example: ISO 9001:2015
 *               auditorLiderId:
 *                 type: string
 *                 format: uuid
 *               fechaPlanificada:
 *                 type: string
 *                 format: date
 *                 example: 2024-11-15
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: 2024-11-01
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: 2024-11-05
 *               estado:
 *                 type: string
 *                 enum: [planificada, en_curso, completada, cancelada]
 *                 default: planificada
 *               creadoPor:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Auditoría creada exitosamente
 *       400:
 *         description: Datos inválidos o código duplicado
 *       401:
 *         description: No autorizado
 */
router.post("/", createAuditoria);

/**
 * @swagger
 * /api/auditorias:
 *   get:
 *     summary: Listar auditorías de calidad
 *     tags: [Auditorías]
 *     description: Obtiene todas las auditorías programadas con filtros opcionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [interna, externa, certificacion, seguimiento]
 *         description: Filtrar por tipo de auditoría
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [planificada, en_curso, completada, cancelada]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de auditorías con relaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 auditorias:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: No autorizado
 */
router.get("/", getAuditorias);

/**
 * @swagger
 * /api/auditorias/{id}:
 *   get:
 *     summary: Obtener auditoría por ID
 *     tags: [Auditorías]
 *     description: Obtiene los detalles de una auditoría específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la auditoría
 *     responses:
 *       200:
 *         description: Detalles de la auditoría
 *       404:
 *         description: Auditoría no encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getAuditoriaById);

/**
 * @swagger
 * /api/auditorias/{id}:
 *   put:
 *     summary: Actualizar auditoría
 *     tags: [Auditorías]
 *     description: Actualiza la información de una auditoría existente
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
 *               tipo:
 *                 type: string
 *                 enum: [interna, externa, certificacion, seguimiento]
 *               objetivo:
 *                 type: string
 *               alcance:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *                 enum: [planificada, en_curso, completada, cancelada]
 *     responses:
 *       200:
 *         description: Auditoría actualizada exitosamente
 *       404:
 *         description: Auditoría no encontrada
 *       400:
 *         description: Cuerpo vacío
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateAuditoria);

/**
 * @swagger
 * /api/auditorias/{id}:
 *   delete:
 *     summary: Eliminar auditoría
 *     tags: [Auditorías]
 *     description: Elimina una auditoría del sistema
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
 *       204:
 *         description: Auditoría eliminada exitosamente
 *       404:
 *         description: Auditoría no encontrada
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteAuditoria);

export default router;
