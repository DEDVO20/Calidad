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
 *     summary: Crear control de riesgo
 *     tags: [Controles de Riesgo]
 *     description: Define un control para mitigar un riesgo identificado
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
 *             properties:
 *               riesgoId:
 *                 type: string
 *                 format: uuid
 *               descripcion:
 *                 type: string
 *                 example: Implementar backup automático diario
 *               tipo:
 *                 type: string
 *                 enum: [preventivo, correctivo, detectivo]
 *                 example: preventivo
 *               frecuencia:
 *                 type: string
 *                 enum: [continuo, diario, semanal, mensual, trimestral, anual]
 *                 example: diario
 *               responsableId:
 *                 type: string
 *                 format: uuid
 *               efectividad:
 *                 type: string
 *                 enum: [baja, media, alta]
 *                 example: alta
 *               fechaImplementacion:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *                 enum: [planificado, implementado, en_revision, obsoleto]
 *                 default: planificado
 *     responses:
 *       201:
 *         description: Control creado
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
 *     summary: Listar controles de riesgo
 *     tags: [Controles de Riesgo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [preventivo, correctivo, detectivo]
 *       - in: query
 *         name: efectividad
 *         schema:
 *           type: string
 *           enum: [baja, media, alta]
 *       - in: query
 *         name: riesgoId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por riesgo específico
 *     responses:
 *       200:
 *         description: Lista de controles
 *       401:
 *         description: No autorizado
 */
router.get("/", getControlesRiesgo);

/**
 * @swagger
 * /api/controles-riesgo/{id}:
 *   get:
 *     summary: Obtener control por ID
 *     tags: [Controles de Riesgo]
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
 *         description: Detalles del control
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
 *               descripcion:
 *                 type: string
 *               efectividad:
 *                 type: string
 *                 enum: [baja, media, alta]
 *               estado:
 *                 type: string
 *                 enum: [planificado, implementado, en_revision, obsoleto]
 *               fechaRevision:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Control actualizado
 *       404:
 *         description: No encontrado
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
 *         description: Control eliminado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteControlRiesgo);

export default router;