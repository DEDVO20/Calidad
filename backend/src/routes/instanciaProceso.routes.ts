import { Router } from "express";
import {
  createInstanciaProceso,
  getInstanciasProceso,
  getInstanciaProcesoById,
  updateInstanciaProceso,
} from "../controllers/instanciaProceso.controller";

const router = Router();

/**
 * @swagger
 * /api/instancias-proceso:
 *   post:
 *     summary: Crear instancia de proceso
 *     tags: [Instancias de Proceso]
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
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               estado:
 *                 type: string
 *                 enum: [iniciada, en_curso, completada, cancelada]
 *     responses:
 *       201:
 *         description: Instancia creada
 *       401:
 *         description: No autorizado
 */
router.post("/", createInstanciaProceso);

/**
 * @swagger
 * /api/instancias-proceso:
 *   get:
 *     summary: Listar instancias de proceso
 *     tags: [Instancias de Proceso]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de instancias
 *       401:
 *         description: No autorizado
 */
router.get("/", getInstanciasProceso);

/**
 * @swagger
 * /api/instancias-proceso/{id}:
 *   get:
 *     summary: Obtener instancia por ID
 *     tags: [Instancias de Proceso]
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
 *         description: Detalles de la instancia
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getInstanciaProcesoById);

/**
 * @swagger
 * /api/instancias-proceso/{id}:
 *   put:
 *     summary: Actualizar instancia
 *     tags: [Instancias de Proceso]
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
 *         description: Instancia actualizada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateInstanciaProceso);

export default router;