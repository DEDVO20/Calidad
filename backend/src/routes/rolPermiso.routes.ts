import { Router } from "express";
import {
  createRolPermiso,
  getRolPermisos,
  getRolPermisoById,
  deleteRolPermiso,
} from "../controllers/rolPermiso.controller";

const router = Router();

/**
 * @swagger
 * /api/roles-permisos:
 *   get:
 *     summary: Obtener todas las asociaciones rol-permiso
 *     tags: [Roles-Permisos]
 *     description: Retorna una lista de todas las asociaciones entre roles y permisos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rolId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de rol
 *       - in: query
 *         name: permisoId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de permiso
 *     responses:
 *       200:
 *         description: Lista de asociaciones rol-permiso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RolPermiso'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getRolPermisos);

/**
 * @swagger
 * /api/roles-permisos/{id}:
 *   get:
 *     summary: Obtener asociación rol-permiso por ID
 *     tags: [Roles-Permisos]
 *     description: Retorna los detalles de una asociación específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asociación
 *     responses:
 *       200:
 *         description: Detalles de la asociación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolPermiso'
 *       404:
 *         description: Asociación no encontrada
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
router.get("/:id", getRolPermisoById);

/**
 * @swagger
 * /api/roles-permisos:
 *   post:
 *     summary: Crear asociación rol-permiso
 *     tags: [Roles-Permisos]
 *     description: Asocia un permiso a un rol
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rolId
 *               - permisoId
 *             properties:
 *               rolId:
 *                 type: integer
 *                 description: ID del rol
 *                 example: 1
 *               permisoId:
 *                 type: integer
 *                 description: ID del permiso
 *                 example: 5
 *     responses:
 *       201:
 *         description: Asociación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 rolPermiso:
 *                   $ref: '#/components/schemas/RolPermiso'
 *       400:
 *         description: Asociación ya existe o datos inválidos
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
router.post("/", createRolPermiso);

/**
 * @swagger
 * /api/roles-permisos/{id}:
 *   delete:
 *     summary: Eliminar asociación rol-permiso
 *     tags: [Roles-Permisos]
 *     description: Elimina la asociación entre un rol y un permiso
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asociación
 *     responses:
 *       200:
 *         description: Asociación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Asociación no encontrada
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
router.delete("/:id", deleteRolPermiso);

export default router;
