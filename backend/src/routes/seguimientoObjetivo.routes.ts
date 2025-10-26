import { Router } from "express";
import {
  createSeguimientoObjetivo,
  getSeguimientosObjetivo,
  getSeguimientoObjetivoById,
  updateSeguimientoObjetivo,
} from "../controllers/seguimientoObjetivo.controller";

const router = Router();

/**
 * @swagger
 * /api/seguimientos-objetivo:
 *   post:
 *     summary: Crear seguimiento de objetivo
 *     tags: [Seguimiento de Objetivos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               objetivoId:
 *                 type: string
 *                 format: uuid
 *               fecha:
 *                 type: string
 *                 format: date
 *               valorMedido:
 *                 type: number
 *               cumplimiento:
 *                 type: number
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seguimiento creado
 *       401:
 *         description: No autorizado
 */
router.post("/", createSeguimientoObjetivo);

/**
 * @swagger
 * /api/seguimientos-objetivo:
 *   get:
 *     summary: Listar seguimientos
 *     tags: [Seguimiento de Objetivos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de seguimientos
 *       401:
 *         description: No autorizado
 */
router.get("/", getSeguimientosObjetivo);

/**
 * @swagger
 * /api/seguimientos-objetivo/{id}:
 *   get:
 *     summary: Obtener seguimiento por ID
 *     tags: [Seguimiento de Objetivos]
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
 *         description: Detalles del seguimiento
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getSeguimientoObjetivoById);

/**
 * @swagger
 * /api/seguimientos-objetivo/{id}:
 *   put:
 *     summary: Actualizar seguimiento
 *     tags: [Seguimiento de Objetivos]
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
 *         description: Seguimiento actualizado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateSeguimientoObjetivo);

export default router;