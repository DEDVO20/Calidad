import { Router } from "express";
import {
  createObjetivoCalidad,
  getObjetivosCalidad,
  getObjetivoCalidadById,
  updateObjetivoCalidad,
} from "../controllers/objetivoCalidad.controller";

const router = Router();

/**
 * @swagger
 * /api/objetivos-calidad:
 *   post:
 *     summary: Crear objetivo de calidad
 *     tags: [Objetivos de Calidad]
 *     description: Define un nuevo objetivo de calidad (ISO 9001 Cláusula 6.2)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: OBJ-2024-001
 *               descripcion:
 *                 type: string
 *                 example: Reducir no conformidades en un 20%
 *               indicadorId:
 *                 type: string
 *                 format: uuid
 *               metaNumerica:
 *                 type: number
 *                 example: 80
 *               unidad:
 *                 type: string
 *                 example: "%"
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-31
 *               responsableId:
 *                 type: string
 *                 format: uuid
 *               estado:
 *                 type: string
 *                 enum: [planificado, en_curso, cumplido, no_cumplido, cancelado]
 *                 default: planificado
 *     responses:
 *       201:
 *         description: Objetivo creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", createObjetivoCalidad);

/**
 * @swagger
 * /api/objetivos-calidad:
 *   get:
 *     summary: Listar objetivos de calidad
 *     tags: [Objetivos de Calidad]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [planificado, en_curso, cumplido, no_cumplido, cancelado]
 *     responses:
 *       200:
 *         description: Lista de objetivos
 *       401:
 *         description: No autorizado
 */
router.get("/", getObjetivosCalidad);

/**
 * @swagger
 * /api/objetivos-calidad/{id}:
 *   get:
 *     summary: Obtener objetivo por ID
 *     tags: [Objetivos de Calidad]
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
 *         description: Detalles del objetivo
 *       404:
 *         description: Objetivo no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getObjetivoCalidadById);

/**
 * @swagger
 * /api/objetivos-calidad/{id}:
 *   put:
 *     summary: Actualizar objetivo
 *     tags: [Objetivos de Calidad]
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
 *               estado:
 *                 type: string
 *                 enum: [planificado, en_curso, cumplido, no_cumplido, cancelado]
 *               metaNumerica:
 *                 type: number
 *     responses:
 *       200:
 *         description: Objetivo actualizado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateObjetivoCalidad);

export default router;