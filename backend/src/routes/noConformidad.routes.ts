import { Router } from "express";
import {
  createNoConformidad,
  getNoConformidades,
  getNoConformidadById,
  updateNoConformidad,
  deleteNoConformidad
} from "../controllers/noConformidad.controller";

const router = Router();

/**
 * @swagger
 * /api/noconformidades:
 *   post:
 *     summary: Crear no conformidad
 *     tags: [No Conformidades]
 *     description: Registra una nueva no conformidad detectada
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
 *               - tipo
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: NC-2024-001
 *               descripcion:
 *                 type: string
 *                 example: Documentos sin firmar en el proceso de producción
 *               tipo:
 *                 type: string
 *                 enum: [producto, proceso, sistema]
 *                 example: proceso
 *               gravedad:
 *                 type: string
 *                 enum: [menor, mayor, critica]
 *                 example: mayor
 *               origenId:
 *                 type: string
 *                 format: uuid
 *                 description: ID del origen (auditoría, reclamo, inspección)
 *               fechaDeteccion:
 *                 type: string
 *                 format: date
 *                 example: 2024-10-26
 *               estado:
 *                 type: string
 *                 enum: [abierta, en_analisis, en_tratamiento, cerrada]
 *                 default: abierta
 *     responses:
 *       201:
 *         description: No conformidad creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", createNoConformidad);

/**
 * @swagger
 * /api/noconformidades:
 *   get:
 *     summary: Listar no conformidades
 *     tags: [No Conformidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [producto, proceso, sistema]
 *       - in: query
 *         name: gravedad
 *         schema:
 *           type: string
 *           enum: [menor, mayor, critica]
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [abierta, en_analisis, en_tratamiento, cerrada]
 *     responses:
 *       200:
 *         description: Lista de no conformidades
 *       401:
 *         description: No autorizado
 */
router.get("/", getNoConformidades);

/**
 * @swagger
 * /api/noconformidades/{id}:
 *   get:
 *     summary: Obtener no conformidad por ID
 *     tags: [No Conformidades]
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
 *         description: Detalles de la no conformidad
 *       404:
 *         description: No conformidad no encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getNoConformidadById);

/**
 * @swagger
 * /api/noconformidades/{id}:
 *   put:
 *     summary: Actualizar no conformidad
 *     tags: [No Conformidades]
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
 *                 enum: [abierta, en_analisis, en_tratamiento, cerrada]
 *               accionCorrectiva:
 *                 type: string
 *               fechaCierre:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: No conformidad actualizada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateNoConformidad);

/**
 * @swagger
 * /api/noconformidades/{id}:
 *   delete:
 *     summary: Eliminar no conformidad
 *     tags: [No Conformidades]
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
 *         description: No conformidad eliminada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deleteNoConformidad);

export default router;
