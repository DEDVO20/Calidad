import { Router } from "express";
import {
  createAsistencia,
  getAsistencias,
  getAsistenciaById,
  updateAsistencia,
  deleteAsistencia,
} from "../controllers/asistenciaCapacitacion.controller";

const router = Router();

/**
 * @swagger
 * /api/asistencias-capacitacion:
 *   post:
 *     summary: Registrar asistencia
 *     tags: [Asistencias a Capacitación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               capacitacionId:
 *                 type: string
 *                 format: uuid
 *               usuarioId:
 *                 type: string
 *                 format: uuid
 *               asistio:
 *                 type: boolean
 *               calificacion:
 *                 type: number
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asistencia registrada
 *       401:
 *         description: No autorizado
 */
router.post("/", createAsistencia);

/**
 * @swagger
 * /api/asistencias-capacitacion:
 *   get:
 *     summary: Listar asistencias
 *     tags: [Asistencias a Capacitación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asistencias
 *       401:
 *         description: No autorizado
 */
router.get("/", getAsistencias);

/**
 * @swagger
 * /api/asistencias-capacitacion/{id}:
 *   get:
 *     summary: Obtener asistencia por ID
 *     tags: [Asistencias a Capacitación]
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
 *         description: Detalles de la asistencia
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getAsistenciaById);

/**
 * @swagger
 * /api/asistencias-capacitacion/{id}:
 *   put:
 *     summary: Actualizar asistencia
 *     tags: [Asistencias a Capacitación]
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
 *     responses:
 *       200:
 *         description: Asistencia actualizada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateAsistencia);

/**
 * @swagger
 * /api/asistencias-capacitacion/{id}:
 *   delete:
 *     summary: Eliminar asistencia
 *     tags: [Asistencias a Capacitación]
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
 *         description: Asistencia eliminada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteAsistencia);

export default router;
