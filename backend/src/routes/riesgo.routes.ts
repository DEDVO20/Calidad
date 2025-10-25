import { Router } from "express";
import {
  createRiesgo,
  getRiesgos,
  getRiesgoById,
  updateRiesgo,
  deleteRiesgo,
} from "../controllers/riesgo.controller";

const router = Router();

/**
 * @swagger
 * /api/riesgos:
 *   post:
 *     summary: Crear nuevo riesgo
 *     tags: [Riesgos]
 *     description: Registra un nuevo riesgo identificado en la organización
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
 *               - descripcion
 *               - categoria
 *               - probabilidad
 *               - impacto
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: R-001
 *               descripcion:
 *                 type: string
 *                 example: Riesgo de pérdida de datos críticos
 *               categoria:
 *                 type: string
 *                 enum: [operacional, financiero, legal, reputacional, estrategico]
 *                 example: operacional
 *               probabilidad:
 *                 type: string
 *                 enum: [muy_baja, baja, media, alta, muy_alta]
 *                 example: media
 *               impacto:
 *                 type: string
 *                 enum: [muy_bajo, bajo, medio, alto, muy_alto]
 *                 example: alto
 *               nivelRiesgo:
 *                 type: string
 *                 enum: [bajo, medio, alto, critico]
 *                 example: alto
 *               estado:
 *                 type: string
 *                 enum: [identificado, en_tratamiento, mitigado, aceptado]
 *                 default: identificado
 *     responses:
 *       201:
 *         description: Riesgo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Riesgo'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", createRiesgo);

/**
 * @swagger
 * /api/riesgos:
 *   get:
 *     summary: Obtener todos los riesgos
 *     tags: [Riesgos]
 *     description: Lista todos los riesgos registrados con filtros opcionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum: [operacional, financiero, legal, reputacional, estrategico]
 *         description: Filtrar por categoría
 *       - in: query
 *         name: nivelRiesgo
 *         schema:
 *           type: string
 *           enum: [bajo, medio, alto, critico]
 *         description: Filtrar por nivel de riesgo
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [identificado, en_tratamiento, mitigado, aceptado]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de riesgos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Riesgo'
 *       401:
 *         description: No autorizado
 */
router.get("/", getRiesgos);

/**
 * @swagger
 * /api/riesgos/{id}:
 *   get:
 *     summary: Obtener riesgo por ID
 *     tags: [Riesgos]
 *     description: Obtiene los detalles de un riesgo específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del riesgo
 *     responses:
 *       200:
 *         description: Detalles del riesgo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Riesgo'
 *       404:
 *         description: Riesgo no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getRiesgoById);

/**
 * @swagger
 * /api/riesgos/{id}:
 *   put:
 *     summary: Actualizar riesgo
 *     tags: [Riesgos]
 *     description: Actualiza la información de un riesgo existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del riesgo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               categoria:
 *                 type: string
 *                 enum: [operacional, financiero, legal, reputacional, estrategico]
 *               probabilidad:
 *                 type: string
 *                 enum: [muy_baja, baja, media, alta, muy_alta]
 *               impacto:
 *                 type: string
 *                 enum: [muy_bajo, bajo, medio, alto, muy_alto]
 *               nivelRiesgo:
 *                 type: string
 *                 enum: [bajo, medio, alto, critico]
 *               estado:
 *                 type: string
 *                 enum: [identificado, en_tratamiento, mitigado, aceptado]
 *     responses:
 *       200:
 *         description: Riesgo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Riesgo'
 *       404:
 *         description: Riesgo no encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateRiesgo);

/**
 * @swagger
 * /api/riesgos/{id}:
 *   delete:
 *     summary: Eliminar riesgo
 *     tags: [Riesgos]
 *     description: Elimina un riesgo del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del riesgo
 *     responses:
 *       200:
 *         description: Riesgo eliminado exitosamente
 *       404:
 *         description: Riesgo no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteRiesgo);

export default router;