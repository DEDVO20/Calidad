import { Router, Request, Response, NextFunction } from "express";
import {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuario.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  uploadProfile,
  handleMulterError,
} from "../middlewares/upload.middleware";

const router = Router();

// Middleware condicional para multer
const conditionalMulter = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    // Si es multipart, usar multer
    return uploadProfile.single('foto')(req, res, next);
  }
  // Si es JSON, pasar directo
  next();
};

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     description: Retorna una lista de todos los usuarios del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     description: Retorna los detalles de un usuario específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
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
router.get("/:id", getUsuarioById);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Usuarios]
 *     description: Crea un nuevo usuario en el sistema
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
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: María García
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria.garcia@sgc.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               areaId:
 *                 type: integer
 *                 example: 2
 *               activo:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Email ya registrado
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
router.post("/", createUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
 *     description: Actualiza los datos de un usuario existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: María García López
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria.garcia@sgc.com
 *               areaId:
 *                 type: integer
 *                 example: 3
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
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
router.put(
  "/:id",
  conditionalMulter,
  handleMulterError,
  updateUsuario,
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   patch:
 *     summary: Actualizar parcialmente usuario
 *     tags: [Usuarios]
 *     description: Actualiza parcialmente los datos de un usuario existente (soporta foto local o URL de Supabase)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               segundoNombre:
 *                 type: string
 *                 example: Carlos
 *               primerApellido:
 *                 type: string
 *                 example: Pérez
 *               segundoApellido:
 *                 type: string
 *                 example: Gómez
 *               correoElectronico:
 *                 type: string
 *                 example: juan.perez@sgc.com
 *               areaId:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               activo:
 *                 type: boolean
 *                 example: true
 *               contrasena:
 *                 type: string
 *                 example: NuevaPassword123!
 *               foto_url:
 *                 type: string
 *                 description: URL de la imagen de perfil en Supabase
 *                 example: https://xxx.supabase.co/storage/v1/object/public/profile-images/123/123-1738123456.jpg
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               segundoNombre:
 *                 type: string
 *               primerApellido:
 *                 type: string
 *               segundoApellido:
 *                 type: string
 *               correoElectronico:
 *                 type: string
 *               areaId:
 *                 type: string
 *               activo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (alternativa a foto_url)
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.patch(
  "/:id",
  conditionalMulter,
  handleMulterError,
  updateUsuario,
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     description: Elimina un usuario del sistema (borrado lógico)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
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
router.delete("/:id", deleteUsuario);

export default router;
