import { Router } from "express";

import {
  createNotificacion,
  getNotificaciones,
  getNotificacionById,
  marcarComoLeida,
  deleteNotificacion,
} from "../controllers/notificacion.controller";

const router = Router();

/**
 * @swagger
 * /api/notificaciones:
 *   post:
 *     summary: Crear nueva notificación
 *     tags: [Notificaciones]
 *     description: Crea una nueva notificación para un usuario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - titulo
 *               - mensaje
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 example: 1
 *               titulo:
 *                 type: string
 *                 example: Nueva auditoría programada
 *               mensaje:
 *                 type: string
 *                 example: Se ha programado una auditoría para el día 25 de octubre
 *               tipo:
 *                 type: string
 *                 enum: [info, advertencia, error, exito]
 *                 default: info
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 */
router.post("/", createNotificacion);

/**
 * @swagger
 * /api/notificaciones:
 *   get:
 *     summary: Obtener notificaciones
 *     tags: [Notificaciones]
 *     description: Retorna una lista de notificaciones filtradas por usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         description: ID del usuario para filtrar notificaciones
 *       - in: query
 *         name: leida
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado de lectura
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacion'
 */
router.get("/", getNotificaciones);

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   get:
 *     summary: Obtener notificación por ID
 *     tags: [Notificaciones]
 *     description: Retorna los detalles de una notificación específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Detalles de la notificación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       404:
 *         description: Notificación no encontrada
 */
router.get("/:id", getNotificacionById);

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   put:
 *     summary: Actualizar notificación
 *     tags: [Notificaciones]
 *     description: Actualiza el estado de una notificación (ej. marcar como leída)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leida:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Notificación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 */
router.put("/:id", marcarComoLeida);

export default router;
