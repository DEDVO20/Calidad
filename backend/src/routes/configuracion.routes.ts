import { Router } from "express";
import {
  createConfiguracion,
  getConfiguraciones,
  getConfiguracionByClave,
  updateConfiguracion,
  deleteConfiguracion,
} from "../controllers/configuracion.controller";

const router = Router();

/**
 * @swagger
 * /api/configuraciones:
 *   get:
 *     summary: Obtener todas las configuraciones
 *     tags: [Configuración]
 *     description: Retorna una lista de todas las configuraciones del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [texto, numero, boolean, json]
 *         description: Filtrar por tipo de configuración
 *     responses:
 *       200:
 *         description: Lista de configuraciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Configuracion'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getConfiguraciones);

/**
 * @swagger
 * /api/configuraciones/{clave}:
 *   get:
 *     summary: Obtener configuración por clave
 *     tags: [Configuración]
 *     description: Retorna el valor de una configuración específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clave
 *         required: true
 *         schema:
 *           type: string
 *         description: Clave de la configuración
 *         example: empresa.nombre
 *     responses:
 *       200:
 *         description: Detalles de la configuración
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Configuracion'
 *       404:
 *         description: Configuración no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:clave", getConfiguracionByClave);

/**
 * @swagger
 * /api/configuraciones:
 *   post:
 *     summary: Crear nueva configuración
 *     tags: [Configuración]
 *     description: Crea una nueva configuración del sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clave
 *               - valor
 *               - tipo
 *             properties:
 *               clave:
 *                 type: string
 *                 description: Clave única de la configuración
 *                 example: empresa.nombre
 *               valor:
 *                 type: string
 *                 description: Valor de la configuración
 *                 example: Mi Empresa S.A.
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la configuración
 *                 example: Nombre de la empresa
 *               tipo:
 *                 type: string
 *                 enum: [texto, numero, boolean, json]
 *                 description: Tipo de dato
 *                 example: texto
 *     responses:
 *       201:
 *         description: Configuración creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 configuracion:
 *                   $ref: '#/components/schemas/Configuracion'
 *       400:
 *         description: Configuración ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", createConfiguracion);

/**
 * @swagger
 * /api/configuraciones/{clave}:
 *   put:
 *     summary: Actualizar configuración
 *     tags: [Configuración]
 *     description: Actualiza el valor de una configuración existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clave
 *         required: true
 *         schema:
 *           type: string
 *         description: Clave de la configuración
 *         example: empresa.nombre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: string
 *                 description: Nuevo valor de la configuración
 *                 example: Nueva Empresa S.A.S.
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción
 *     responses:
 *       200:
 *         description: Configuración actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 configuracion:
 *                   $ref: '#/components/schemas/Configuracion'
 *       404:
 *         description: Configuración no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:clave", updateConfiguracion);

/**
 * @swagger
 * /api/configuraciones/{clave}:
 *   delete:
 *     summary: Eliminar configuración
 *     tags: [Configuración]
 *     description: Elimina una configuración del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clave
 *         required: true
 *         schema:
 *           type: string
 *         description: Clave de la configuración
 *         example: empresa.telefono
 *     responses:
 *       200:
 *         description: Configuración eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Configuración no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:clave", deleteConfiguracion);

export default router;
