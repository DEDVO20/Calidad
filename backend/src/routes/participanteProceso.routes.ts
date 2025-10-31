import { Router } from "express";
import {
  createParticipante,
  getParticipantes,
  getParticipanteById,
  updateParticipante,
  deleteParticipante,
} from "../controllers/participanteProceso.controller";

const router = Router();

/**
 * @swagger
 * /api/participantes-proceso:
 *   post:
 *     summary: Agregar participante a proceso
 *     tags: [Participantes de Proceso]
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
 *               usuarioId:
 *                 type: string
 *                 format: uuid
 *               rol:
 *                 type: string
 *                 enum: [responsable, participante, consultor]
 *     responses:
 *       201:
 *         description: Participante agregado
 *       401:
 *         description: No autorizado
 */
router.post("/", createParticipante);

/**
 * @swagger
 * /api/participantes-proceso:
 *   get:
 *     summary: Listar participantes
 *     tags: [Participantes de Proceso]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de participantes
 *       401:
 *         description: No autorizado
 */
router.get("/", getParticipantes);

/**
 * @swagger
 * /api/participantes-proceso/{id}:
 *   get:
 *     summary: Obtener participante por ID
 *     tags: [Participantes de Proceso]
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
 *         description: Detalles
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getParticipanteById);

/**
 * @swagger
 * /api/participantes-proceso/{id}:
 *   put:
 *     summary: Actualizar participante
 *     tags: [Participantes de Proceso]
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
 *         description: Actualizado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateParticipante);

/**
 * @swagger
 * /api/participantes-proceso/{id}:
 *   delete:
 *     summary: Eliminar participante
 *     tags: [Participantes de Proceso]
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
 *         description: Eliminado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteParticipante);

export default router;
