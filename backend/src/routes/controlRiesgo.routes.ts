import { Router } from "express";
import {
  createControlRiesgo,
  getControlesRiesgo,
  getControlRiesgoById,
  updateControlRiesgo,
  deleteControlRiesgo,
} from "../controllers/controlRiesgo.controller";

const router = Router();

/**
 * @swagger
 * /api/controles-riesgo:
 *   post:
 *     summary: Crear nuevo control de riesgo
 *     tags: [Controles de Riesgo]
 *     description: Registra un nuevo control para mitigar un riesgo identificado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - riesgoId
 *               - descripcion
 *               - tipo
 *             properties:
 *               riesgoId:
 *                 type: integer
 *                 description: ID del riesgo asociado
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: Backup diario de base de datos
 *               tipo:
 *                 type: string
 *                 enum: [preventivo, correctivo, detectivo]
 *                 example: preventivo
 *               frecuencia:
 *                 type: string
 *                 enum: [continuo, diario, semanal, mensual, trimestral, anual]
 *                 example: diario
 *               responsable:
 *                 type: string
 *                 example: Área de TI
 *               efectividad:
 *                 type: string
 *                 enum: [baja, media, alta]
 *                 example: alta
 *     responses:
 *       201:
 *         description: Control creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ControlRiesgo'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", createControlRiesgo);

/**
 * @swagger
 * /api/controles-riesgo:
 *   get:
 *     summary: Obtener todos los controles de riesgo
 *     tags: [Controles de Riesgo]
 *     description: Lista todos los controles registrados con filtros opcionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: riesgoId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de riesgo
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [preventivo, correctivo, detectivo]
 *         description: Filtrar por tipo de control
 *       - in: query
 *         name: efectividad
 *         schema:
 *           type: string
 *           enum: [baja, media, alta]
 *         description: Filtrar por efectividad
 *     responses:
 *       200:
 *         description: Lista de controles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ControlRiesgo'
 *       401:
 *         description: No autorizado
 */
router.get("/", getControlesRiesgo);

/**
 * @swagger
 * /api/controles-riesgo/{id}:
 *   get:
 *     summary: Obtener control de riesgo por ID
 *     tags: [Controles de Riesgo]
 *     description: Obtiene los detalles de un control específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del control
 *     responses:
 *       200:
 *         description: Detalles del control
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ControlRiesgo'
 *       404:
 *         description: Control no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getControlRiesgoById);

/**
 * @swagger
 * /api/controles-riesgo/{id}:
 *   put:
 *     summary: Actualizar control de riesgo
 *     tags: [Controles de Riesgo]
 *     description: Actualiza la información de un control existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del control
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [preventivo, correctivo, detectivo]
 *               frecuencia:
 *                 type: string
 *                 enum: [continuo, diario, semanal, mensual, trimestral, anual]
 *               responsable:
 *                 type: string
 *               efectividad:
 *                 type: string
 *                 enum: [baja, media, alta]
 *     responses:
 *       200:
 *         description: Control actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ControlRiesgo'
 *       404:
 *         description: Control no encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateControlRiesgo);

/**
 * @swagger
 * /api/controles-riesgo/{id}:
 *   delete:
 *     summary: Eliminar control de riesgo
 *     tags: [Controles de Riesgo]
 *     description: Elimina un control del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del control
 *     responses:
 *       200:
 *         description: Control eliminado exitosamente
 *       404:
 *         description: Control no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteControlRiesgo);

export default router;