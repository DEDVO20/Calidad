import { Router } from "express";
import {
  createIndicador,
  getIndicadores,
  getIndicadorById,
  updateIndicador,
} from "../controllers/indicador.controller";

const router = Router();

/**
 * @swagger
 * /api/indicadores:
 *   post:
 *     summary: Crear indicador
 *     tags: [Indicadores]
 *     description: Crea un indicador de desempeño (ISO 9001 Cláusula 9.1)
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
 *               - formula
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: IND-001
 *               nombre:
 *                 type: string
 *                 example: Índice de No Conformidades
 *               descripcion:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [eficacia, eficiencia, cumplimiento, satisfaccion]
 *                 example: eficacia
 *               formula:
 *                 type: string
 *                 example: (No Conformidades / Total Productos) * 100
 *               unidadMedida:
 *                 type: string
 *                 example: "%"
 *               meta:
 *                 type: number
 *                 example: 95
 *               frecuenciaMedicion:
 *                 type: string
 *                 enum: [diaria, semanal, mensual, trimestral, anual]
 *                 example: mensual
 *               responsableId:
 *                 type: string
 *                 format: uuid
 *               estado:
 *                 type: string
 *                 enum: [activo, inactivo]
 *                 default: activo
 *     responses:
 *       201:
 *         description: Indicador creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", createIndicador);

/**
 * @swagger
 * /api/indicadores:
 *   get:
 *     summary: Listar indicadores
 *     tags: [Indicadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [eficacia, eficiencia, cumplimiento, satisfaccion]
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [activo, inactivo]
 *     responses:
 *       200:
 *         description: Lista de indicadores
 *       401:
 *         description: No autorizado
 */
router.get("/", getIndicadores);

/**
 * @swagger
 * /api/indicadores/{id}:
 *   get:
 *     summary: Obtener indicador por ID
 *     tags: [Indicadores]
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
 *         description: Detalles del indicador
 *       404:
 *         description: Indicador no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getIndicadorById);

/**
 * @swagger
 * /api/indicadores/{id}:
 *   put:
 *     summary: Actualizar indicador
 *     tags: [Indicadores]
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
 *               meta:
 *                 type: number
 *               estado:
 *                 type: string
 *                 enum: [activo, inactivo]
 *     responses:
 *       200:
 *         description: Indicador actualizado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateIndicador);

export default router;