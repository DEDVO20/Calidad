import { Router } from "express";
import {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
} from "../controllers/area.controller";

const router = Router();

/**
 * @swagger
 * /api/areas:
 *   post:
 *     summary: Crear nueva área
 *     tags: [Áreas]
 *     description: Crea una nueva área organizacional
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Recursos Humanos
 *               descripcion:
 *                 type: string
 *                 example: Área encargada de la gestión del talento humano
 *               activa:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Área creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 area:
 *                   $ref: '#/components/schemas/Area'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", createArea);

/**
 * @swagger
 * /api/areas:
 *   get:
 *     summary: Obtener todas las áreas
 *     tags: [Áreas]
 *     description: Retorna una lista de todas las áreas organizacionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activa
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo
 *     responses:
 *       200:
 *         description: Lista de áreas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getAreas);

/**
 * @swagger
 * /api/areas/{id}:
 *   get:
 *     summary: Obtener área por ID
 *     tags: [Áreas]
 *     description: Retorna los detalles de un área específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del área
 *     responses:
 *       200:
 *         description: Detalles del área
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       404:
 *         description: Área no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getAreaById);

/**
 * @swagger
 * /api/areas/{id}:
 *   put:
 *     summary: Actualizar área
 *     tags: [Áreas]
 *     description: Actualiza los datos de un área existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del área
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Recursos Humanos y Desarrollo
 *               descripcion:
 *                 type: string
 *                 example: Área encargada de la gestión y desarrollo del talento humano
 *               activa:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Área actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 area:
 *                   $ref: '#/components/schemas/Area'
 *       404:
 *         description: Área no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", updateArea);

export default router;
