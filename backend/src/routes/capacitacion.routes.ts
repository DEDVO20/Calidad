import { Router } from "express";
import {
  createCapacitacion,
  getCapacitaciones,
  getCapacitacionById,
  updateCapacitacion,
  deleteCapacitacion
} from "../controllers/capacitacion.controller";

const router = Router();

/**
 * @swagger
 * /api/capacitaciones:
 *   post:
 *     summary: Crear capacitación
 *     tags: [Capacitaciones]
 *     description: Programa una nueva capacitación para el personal (ISO 9001 Cláusula 7.2)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - fecha
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: CAP-2024-001
 *               titulo:
 *                 type: string
 *                 example: ISO 9001:2015 Fundamentos
 *               descripcion:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [interna, externa, online]
 *                 example: interna
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-11-15T09:00:00Z
 *               duracion:
 *                 type: integer
 *                 description: Duración en horas
 *                 example: 8
 *               instructorId:
 *                 type: string
 *                 format: uuid
 *               lugarRealizacion:
 *                 type: string
 *                 example: Sala de capacitaciones
 *               estado:
 *                 type: string
 *                 enum: [programada, en_curso, completada, cancelada]
 *                 default: programada
 *     responses:
 *       201:
 *         description: Capacitación creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", createCapacitacion);

/**
 * @swagger
 * /api/capacitaciones:
 *   get:
 *     summary: Listar capacitaciones
 *     tags: [Capacitaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [interna, externa, online]
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [programada, en_curso, completada, cancelada]
 *     responses:
 *       200:
 *         description: Lista de capacitaciones
 *       401:
 *         description: No autorizado
 */
router.get("/", getCapacitaciones);

/**
 * @swagger
 * /api/capacitaciones/{id}:
 *   get:
 *     summary: Obtener capacitación por ID
 *     tags: [Capacitaciones]
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
 *         description: Detalles de la capacitación
 *       404:
 *         description: Capacitación no encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getCapacitacionById);

/**
 * @swagger
 * /api/capacitaciones/{id}:
 *   put:
 *     summary: Actualizar capacitación
 *     tags: [Capacitaciones]
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
 *               titulo:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               estado:
 *                 type: string
 *                 enum: [programada, en_curso, completada, cancelada]
 *               resultados:
 *                 type: string
 *     responses:
 *       200:
 *         description: Capacitación actualizada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateCapacitacion);

/**
 * @swagger
 * /api/capacitaciones/{id}:
 *   delete:
 *     summary: Eliminar capacitación
 *     tags: [Capacitaciones]
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
 *         description: Capacitación eliminada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteCapacitacion);

export default router;
