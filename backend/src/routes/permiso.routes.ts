import { Router } from "express";
import {
  createPermiso,
  getPermisos,
  getPermisoById,
  updatePermiso,
  deletePermiso,
} from "../controllers/permiso.controller";

const router = Router();

/**
 * @swagger
 * /api/permisos:
 *   get:
 *     summary: Obtener todos los permisos
 *     tags: [Permisos]
 *     description: Retorna una lista de todos los permisos del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: modulo
 *         schema:
 *           type: string
 *         description: Filtrar por módulo
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo
 *     responses:
 *       200:
 *         description: Lista de permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permiso'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getPermisos);

/**
 * @swagger
 * /api/permisos/{id}:
 *   get:
 *     summary: Obtener permiso por ID
 *     tags: [Permisos]
 *     description: Retorna los detalles de un permiso específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso
 *     responses:
 *       200:
 *         description: Detalles del permiso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permiso'
 *       404:
 *         description: Permiso no encontrado
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
router.get("/:id", getPermisoById);

/**
 * @swagger
 * /api/permisos:
 *   post:
 *     summary: Crear nuevo permiso
 *     tags: [Permisos]
 *     description: Crea un nuevo permiso en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - modulo
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del permiso
 *                 example: documentos.crear
 *               descripcion:
 *                 type: string
 *                 description: Descripción del permiso
 *                 example: Permite crear nuevos documentos
 *               modulo:
 *                 type: string
 *                 description: Módulo al que pertenece
 *                 example: documentos
 *               activo:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Permiso creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 permiso:
 *                   $ref: '#/components/schemas/Permiso'
 *       400:
 *         description: Permiso ya existe
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
router.post("/", createPermiso);

/**
 * @swagger
 * /api/permisos/{id}:
 *   put:
 *     summary: Actualizar permiso
 *     tags: [Permisos]
 *     description: Actualiza los datos de un permiso existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: documentos.editar
 *               descripcion:
 *                 type: string
 *                 example: Permite editar documentos existentes
 *               modulo:
 *                 type: string
 *                 example: documentos
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Permiso actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 permiso:
 *                   $ref: '#/components/schemas/Permiso'
 *       404:
 *         description: Permiso no encontrado
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
router.put("/:id", updatePermiso);

/**
 * @swagger
 * /api/permisos/{id}:
 *   delete:
 *     summary: Eliminar permiso
 *     tags: [Permisos]
 *     description: Elimina un permiso del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso
 *     responses:
 *       200:
 *         description: Permiso eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Permiso no encontrado
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
router.delete("/:id", deletePermiso);

export default router;
