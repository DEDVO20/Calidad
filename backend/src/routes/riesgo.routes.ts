import { Router } from "express";
import {
  createRiesgo,
  getRiesgos,
  getRiesgoById,
  updateRiesgo,
  deleteRiesgo,
} from "../controllers/riesgo.controller";
import { optionalAuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware opcional de autenticación a todas las rutas
router.use(optionalAuthMiddleware);

/**
 * @swagger
 * /api/riesgos:
 *   post:
 *     summary: Crear riesgo
 *     tags: [Riesgos]
 *     description: Identifica un nuevo riesgo según ISO 9001 Cláusula 6.1
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
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: R-001
 *               descripcion:
 *                 type: string
 *                 example: Falla en el sistema de gestión documental
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
 *               causas:
 *                 type: string
 *               consecuencias:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [identificado, en_tratamiento, mitigado, aceptado]
 *                 default: identificado
 *     responses:
 *       201:
 *         description: Riesgo creado exitosamente
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
 *     summary: Listar riesgos
 *     tags: [Riesgos]
 *     description: Obtiene todos los riesgos con filtros opcionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum: [operacional, financiero, legal, reputacional, estrategico]
 *       - in: query
 *         name: nivelRiesgo
 *         schema:
 *           type: string
 *           enum: [bajo, medio, alto, critico]
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [identificado, en_tratamiento, mitigado, aceptado]
 *     responses:
 *       200:
 *         description: Lista de riesgos
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
 *         description: Detalles del riesgo
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
 *         description: Riesgo actualizado
 *       404:
 *         description: No encontrado
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
 *         description: Riesgo eliminado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteRiesgo);

export default router;