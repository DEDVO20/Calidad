import { Router } from "express";
import {
  createAsignacion,
  getAllAsignaciones,
  getAsignacionById,
  getAsignacionesByArea,
  getAsignacionesByUsuario,
  updateAsignacion,
  deleteAsignacion,
  deleteAsignacionesByArea,
  deleteAsignacionesByUsuario,
} from "../controllers/asignacion.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

/**
 * @swagger
 * /api/asignaciones:
 *   post:
 *     summary: Crear una nueva asignación de responsable
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - areaId
 *               - usuarioId
 *             properties:
 *               areaId:
 *                 type: string
 *                 format: uuid
 *               usuarioId:
 *                 type: string
 *                 format: uuid
 *               esPrincipal:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Asignación creada exitosamente
 *       400:
 *         description: Datos inválidos o asignación duplicada
 *       404:
 *         description: Área o usuario no encontrado
 *       500:
 *         description: Error al crear la asignación
 */
router.post("/", createAsignacion);

/**
 * @swagger
 * /api/asignaciones:
 *   get:
 *     summary: Obtener todas las asignaciones
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones
 *       500:
 *         description: Error al obtener las asignaciones
 */
router.get("/", getAllAsignaciones);

/**
 * @swagger
 * /api/asignaciones/{id}:
 *   get:
 *     summary: Obtener una asignación por ID
 *     tags: [Asignaciones]
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
 *         description: Asignación encontrada
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al obtener la asignación
 */
router.get("/:id", getAsignacionById);

/**
 * @swagger
 * /api/asignaciones/area/{areaId}:
 *   get:
 *     summary: Obtener asignaciones por área
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: areaId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de asignaciones del área
 *       500:
 *         description: Error al obtener las asignaciones del área
 */
router.get("/area/:areaId", getAsignacionesByArea);

/**
 * @swagger
 * /api/asignaciones/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener asignaciones por usuario
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de asignaciones del usuario
 *       500:
 *         description: Error al obtener las asignaciones del usuario
 */
router.get("/usuario/:usuarioId", getAsignacionesByUsuario);

/**
 * @swagger
 * /api/asignaciones/{id}:
 *   put:
 *     summary: Actualizar una asignación
 *     tags: [Asignaciones]
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
 *               areaId:
 *                 type: string
 *                 format: uuid
 *               usuarioId:
 *                 type: string
 *                 format: uuid
 *               esPrincipal:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Asignación actualizada exitosamente
 *       404:
 *         description: Asignación, área o usuario no encontrado
 *       500:
 *         description: Error al actualizar la asignación
 */
router.put("/:id", updateAsignacion);

/**
 * @swagger
 * /api/asignaciones/{id}:
 *   delete:
 *     summary: Eliminar una asignación
 *     tags: [Asignaciones]
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
 *         description: Asignación eliminada exitosamente
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al eliminar la asignación
 */
router.delete("/:id", deleteAsignacion);

/**
 * @swagger
 * /api/asignaciones/area/{areaId}/all:
 *   delete:
 *     summary: Eliminar todas las asignaciones de un área
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: areaId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Asignaciones eliminadas exitosamente
 *       500:
 *         description: Error al eliminar las asignaciones del área
 */
router.delete("/area/:areaId/all", deleteAsignacionesByArea);

/**
 * @swagger
 * /api/asignaciones/usuario/{usuarioId}/all:
 *   delete:
 *     summary: Eliminar todas las asignaciones de un usuario
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Asignaciones eliminadas exitosamente
 *       500:
 *         description: Error al eliminar las asignaciones del usuario
 */
router.delete("/usuario/:usuarioId/all", deleteAsignacionesByUsuario);

export default router;
