import { Router } from "express";
import {
  createRol,
  getRoles,
  getRolById,
  updateRol,
  deleteRol,
  addPermisosToRol,
  removePermisosFromRol,
} from "../controllers/rol.controller";

const router = Router();

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     description: Retorna una lista de todos los roles del sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 */
router.get("/", getRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener rol por ID
 *     tags: [Roles]
 *     description: Retorna los detalles de un rol específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Detalles del rol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       404:
 *         description: Rol no encontrado
 */
router.get("/:id", getRolById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear nuevo rol
 *     tags: [Roles]
 *     description: Crea un nuevo rol en el sistema
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
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Auditor
 *               descripcion:
 *                 type: string
 *                 example: Rol para auditores del sistema de calidad
 *               activo:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 */
router.post("/", createRol);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualizar rol
 *     tags: [Roles]
 *     description: Actualiza los datos de un rol existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
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
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 */
router.put("/:id", updateRol);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar rol
 *     tags: [Roles]
 *     description: Elimina un rol del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 */
router.delete("/:id", deleteRol);

/**
 * @swagger
 * /api/roles/{id}/permisos:
 *   post:
 *     summary: Agregar permisos a un rol
 *     tags: [Roles]
 *     description: Asocia múltiples permisos a un rol
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permisoIds
 *             properties:
 *               permisoIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Permisos agregados exitosamente
 */
router.post("/:id/permisos", addPermisosToRol);

/**
 * @swagger
 * /api/roles/{id}/permisos:
 *   delete:
 *     summary: Remover permisos de un rol
 *     tags: [Roles]
 *     description: Elimina múltiples permisos de un rol
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permisoIds
 *             properties:
 *               permisoIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: Permisos removidos exitosamente
 */
router.delete("/:id/permisos", removePermisosFromRol);

export default router;
