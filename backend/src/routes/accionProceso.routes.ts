import { Router } from "express";
import {
  createAccionProceso,
  getAccionesProceso,
  getAccionProcesoById,
  updateAccionProceso,
} from "../controllers/accionProceso.controller";

const router = Router();

/**
 * @swagger
 * /api/acciones-proceso:
 *   post:
 *     summary: Crear acción de proceso
 *     tags: [Acciones de Proceso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               procesoId:
 *                 type: string
 *                 format: uuid
 *               descripcion:
 *                 type: string
 *               responsableId:
 *                 type: string
 *                 format: uuid
 *               fechaCompromiso:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en_progreso, completada, cancelada]
 *     responses:
 *       201:
 *         description: Acción creada
 *       401:
 *         description: No autorizado
 */
router.post("/", createAccionProceso);

/**
 * @swagger
 * /api/acciones-proceso:
 *   get:
 *     summary: Listar acciones de proceso
 *     tags: [Acciones de Proceso]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de acciones
 *       401:
 *         description: No autorizado
 */
router.get("/", getAccionesProceso);

/**
 * @swagger
 * /api/acciones-proceso/{id}:
 *   get:
 *     summary: Obtener acción por ID
 *     tags: [Acciones de Proceso]
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
 *         description: Detalles de la acción
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getAccionProcesoById);

/**
 * @swagger
 * /api/acciones-proceso/{id}:
 *   put:
 *     summary: Actualizar acción
 *     tags: [Acciones de Proceso]
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
 *         description: Acción actualizada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateAccionProceso);

export default router;