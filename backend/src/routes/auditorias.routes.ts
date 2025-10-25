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
 *     summary: Crear nueva auditoría
 *     tags: [Auditorías]
 *     description: Programa una nueva auditoría en el sistema
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
 *               - tipo
 *               - fechaInicio
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: AUD-2024-001
 *               tipo:
 *                 type: string
 *                 enum: [interna, externa, certificacion]
 *                 example: interna
 *               estado:
 *                 type: string
 *                 enum: [planificada, en_curso, completada, cancelada]
 *                 default: planificada
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-11-01T09:00:00Z
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-11-05T17:00:00Z
 *               alcance:
 *                 type: string
 *                 example: Procesos de producción y calidad
 *               criterios:
 *                 type: string
 *                 example: ISO 9001:2015
 *               equipo:
 *                 type: string
 *                 example: Auditor Líder: Juan Pérez
 *     responses:
 *       201:
 *         description: Auditoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auditoria'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", createAuditoria);

/**
 * @swagger
 * /api/auditorias:
 *   get:
 *     summary: Obtener todas las auditorías
 *     tags: [Auditorías]
 *     description: Lista todas las auditorías programadas con filtros opcionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [interna, externa, certificacion]
 *         description: Filtrar por tipo de auditoría
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [planificada, en_curso, completada, cancelada]
 *         description: Filtrar por estado
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango
 *     responses:
 *       200:
 *         description: Lista de auditorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auditoria'
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
 *           type: integer
 *         description: ID de la auditoría
 *     responses:
 *       200:
 *         description: Detalles de la auditoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auditoria'
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
 *           type: integer
 *         description: ID de la auditoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [interna, externa, certificacion]
 *               estado:
 *                 type: string
 *                 enum: [planificada, en_curso, completada, cancelada]
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *               alcance:
 *                 type: string
 *               criterios:
 *                 type: string
 *               equipo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auditoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auditoria'
 *       404:
 *         description: Auditoría no encontrada
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
 *           type: integer
 *         description: ID de la auditoría
 *     responses:
 *       200:
 *         description: Auditoría eliminada exitosamente
 *       404:
 *         description: Auditoría no encontrada
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteAuditoria);

export default router;
