import { Router } from "express";
import {
  createUsuarioRol,
  getAllUsuarioRoles,
  getUsuarioRolById,
  getRolesByUsuario,
  getUsuariosByRol,
  getUsuarioRolesByArea,
  updateUsuarioRol,
  deleteUsuarioRol,
  deleteRolesByUsuario,
} from "../controllers/usuarioRol.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

/**
 * @swagger
 * /api/usuario-roles:
 *   post:
 *     summary: Crear una nueva asignación de rol a usuario
 *     tags: [UsuarioRoles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - rolId
 *             properties:
 *               usuarioId:
 *                 type: string
 *                 format: uuid
 *               rolId:
 *                 type: string
 *                 format: uuid
 *               areaId:
 *                 type: string
 *                 format: uuid
 *               asignadoPor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asignación de rol creada exitosamente
 *       500:
 *         description: Error al crear la asignación de rol
 */
router.post("/", createUsuarioRol);

/**
 * @swagger
 * /api/usuario-roles:
 *   get:
 *     summary: Obtener todas las asignaciones de roles
 *     tags: [UsuarioRoles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones de roles
 *       500:
 *         description: Error al obtener las asignaciones de roles
 */
router.get("/", getAllUsuarioRoles);

/**
 * @swagger
 * /api/usuario-roles/{id}:
 *   get:
 *     summary: Obtener una asignación de rol por ID
 *     tags: [UsuarioRoles]
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
 *         description: Asignación de rol encontrada
 *       404:
 *         description: Asignación de rol no encontrada
 *       500:
 *         description: Error al obtener la asignación de rol
 */
router.get("/:id", getUsuarioRolById);

/**
 * @swagger
 * /api/usuario-roles/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener todos los roles de un usuario
 *     tags: [UsuarioRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de roles del usuario
 *       500:
 *         description: Error al obtener los roles del usuario
 */
router.get("/usuario/:usuarioId", getRolesByUsuario);

/**
 * @swagger
 * /api/usuario-roles/rol/{rolId}:
 *   get:
 *     summary: Obtener todos los usuarios con un rol específico
 *     tags: [UsuarioRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rolId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de usuarios con el rol
 *       500:
 *         description: Error al obtener los usuarios del rol
 */
router.get("/rol/:rolId", getUsuariosByRol);

/**
 * @swagger
 * /api/usuario-roles/area/{areaId}:
 *   get:
 *     summary: Obtener asignaciones de roles por área
 *     tags: [UsuarioRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: areaId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de asignaciones de roles del área
 *       500:
 *         description: Error al obtener las asignaciones de roles del área
 */
router.get("/area/:areaId", getUsuarioRolesByArea);

/**
 * @swagger
 * /api/usuario-roles/{id}:
 *   put:
 *     summary: Actualizar una asignación de rol
 *     tags: [UsuarioRoles]
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
 *               usuarioId:
 *                 type: string
 *                 format: uuid
 *               rolId:
 *                 type: string
 *                 format: uuid
 *               areaId:
 *                 type: string
 *                 format: uuid
 *               asignadoPor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asignación de rol actualizada exitosamente
 *       404:
 *         description: Asignación de rol no encontrada
 *       500:
 *         description: Error al actualizar la asignación de rol
 */
router.put("/:id", updateUsuarioRol);

/**
 * @swagger
 * /api/usuario-roles/{id}:
 *   delete:
 *     summary: Eliminar una asignación de rol
 *     tags: [UsuarioRoles]
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
 *         description: Asignación de rol eliminada exitosamente
 *       404:
 *         description: Asignación de rol no encontrada
 *       500:
 *         description: Error al eliminar la asignación de rol
 */
router.delete("/:id", deleteUsuarioRol);

/**
 * @swagger
 * /api/usuario-roles/usuario/{usuarioId}/all:
 *   delete:
 *     summary: Eliminar todas las asignaciones de roles de un usuario
 *     tags: [UsuarioRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Asignaciones de roles eliminadas exitosamente
 *       500:
 *         description: Error al eliminar las asignaciones de roles del usuario
 */
router.delete("/usuario/:usuarioId/all", deleteRolesByUsuario);

export default router;
