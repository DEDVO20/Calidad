import { Router } from "express";
import {
  createAccionCorrectiva,
  getAccionesCorrectivas,
  getAccionCorrectivaById,
  updateAccionCorrectiva,
} from "../controllers/accionCorrectiva.controller";

const router = Router();

/**
 * @swagger
 * /api/acciones-correctivas:
 *   post:
 *     summary: Crear acción correctiva
 *     tags: [Acciones Correctivas]
 *     description: Crea una nueva acción correctiva según ISO 9001 Cláusula 10.2
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
 *               descripcion:
 *                 type: string
 *                 example: Corregir proceso de validación de documentos
 *               tipo:
 *                 type: string
 *                 enum: [correctiva, preventiva]
 *                 example: correctiva
 *               causaRaiz:
 *                 type: string
 *                 example: Falta de capacitación del personal
 *               responsableId:
 *                 type: string
 *                 format: uuid
 *               fechaDeteccion:
 *                 type: string
 *                 format: date
 *                 example: 2024-10-26
 *               fechaCompromiso:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *                 enum: [abierta, en_proceso, cerrada, verificada]
 *                 default: abierta
 *     responses:
 *       201:
 *         description: Acción correctiva creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", createAccionCorrectiva);

/**
 * @swagger
 * /api/acciones-correctivas:
 *   get:
 *     summary: Listar acciones correctivas
 *     tags: [Acciones Correctivas]
 *     description: Obtiene todas las acciones correctivas con filtros opcionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [correctiva, preventiva]
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [abierta, en_proceso, cerrada, verificada]
 *     responses:
 *       200:
 *         description: Lista de acciones correctivas
 *       401:
 *         description: No autorizado
 */
router.get("/", getAccionesCorrectivas);

/**
 * @swagger
 * /api/acciones-correctivas/{id}:
 *   get:
 *     summary: Obtener acción correctiva por ID
 *     tags: [Acciones Correctivas]
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
 *         description: Detalles de la acción correctiva
 *       404:
 *         description: Acción correctiva no encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getAccionCorrectivaById);

/**
 * @swagger
 * /api/acciones-correctivas/{id}:
 *   put:
 *     summary: Actualizar acción correctiva
 *     tags: [Acciones Correctivas]
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
 *                 enum: [abierta, en_proceso, cerrada, verificada]
 *               fechaCierre:
 *                 type: string
 *                 format: date
 *               eficacia:
 *                 type: string
 *                 enum: [pendiente, eficaz, no_eficaz]
 *     responses:
 *       200:
 *         description: Acción correctiva actualizada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateAccionCorrectiva);

export default router;