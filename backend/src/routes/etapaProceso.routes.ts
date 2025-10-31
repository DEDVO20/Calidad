import { Router } from "express";
import {
  createEtapaProceso,
  getEtapasProceso,
  getEtapaProcesoById,
  updateEtapaProceso,
} from "../controllers/etapaProceso.controller";

const router = Router();

/**
 * @swagger
 * /api/etapas-proceso:
 *   post:
 *     summary: Crear etapa de proceso
 *     tags: [Etapas de Proceso]
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
 *               nombre:
 *                 type: string
 *               orden:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Etapa creada
 *       401:
 *         description: No autorizado
 */
router.post("/", createEtapaProceso);

/**
 * @swagger
 * /api/etapas-proceso:
 *   get:
 *     summary: Listar etapas de proceso
 *     tags: [Etapas de Proceso]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de etapas
 *       401:
 *         description: No autorizado
 */
router.get("/", getEtapasProceso);

/**
 * @swagger
 * /api/etapas-proceso/{id}:
 *   get:
 *     summary: Obtener etapa por ID
 *     tags: [Etapas de Proceso]
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
 *         description: Detalles de la etapa
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getEtapaProcesoById);

/**
 * @swagger
 * /api/etapas-proceso/{id}:
 *   put:
 *     summary: Actualizar etapa
 *     tags: [Etapas de Proceso]
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
 *         description: Etapa actualizada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateEtapaProceso);

export default router;