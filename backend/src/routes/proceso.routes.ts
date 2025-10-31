import { Router } from "express";
import {
  createProceso,
  getProcesos,
  getProcesoById,
  updateProceso,
} from "../controllers/proceso.controller";

const router = Router();

/**
 * @swagger
 * /api/procesos:
 *   post:
 *     summary: Crear proceso
 *     tags: [Procesos]
 *     description: Crea un nuevo proceso del sistema de gestión (ISO 9001 Cláusula 4.4)
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
 *               - nombre
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: PRO-001
 *               nombre:
 *                 type: string
 *                 example: Proceso de Producción
 *               descripcion:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [estrategico, operativo, apoyo]
 *                 example: operativo
 *               objetivo:
 *                 type: string
 *                 example: Fabricar productos que cumplan especificaciones
 *               alcance:
 *                 type: string
 *               responsableId:
 *                 type: string
 *                 format: uuid
 *               estado:
 *                 type: string
 *                 enum: [activo, inactivo, en_revision]
 *                 default: activo
 *     responses:
 *       201:
 *         description: Proceso creado exitosamente
 *       400:
 *         description: Datos inválidos o código duplicado
 *       401:
 *         description: No autorizado
 */
router.post("/", createProceso);

/**
 * @swagger
 * /api/procesos:
 *   get:
 *     summary: Listar procesos
 *     tags: [Procesos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [estrategico, operativo, apoyo]
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [activo, inactivo, en_revision]
 *     responses:
 *       200:
 *         description: Lista de procesos
 *       401:
 *         description: No autorizado
 */
router.get("/", getProcesos);

/**
 * @swagger
 * /api/procesos/{id}:
 *   get:
 *     summary: Obtener proceso por ID
 *     tags: [Procesos]
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
 *         description: Detalles del proceso
 *       404:
 *         description: Proceso no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getProcesoById);

/**
 * @swagger
 * /api/procesos/{id}:
 *   put:
 *     summary: Actualizar proceso
 *     tags: [Procesos]
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [activo, inactivo, en_revision]
 *               objetivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proceso actualizado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateProceso);

export default router;