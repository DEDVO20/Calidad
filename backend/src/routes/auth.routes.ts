import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
  verifyToken,
} from "../controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Autenticación]
 *     description: Devuelve la información completa del usuario actualmente autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     documento:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     segundoNombre:
 *                       type: string
 *                     primerApellido:
 *                       type: string
 *                     segundoApellido:
 *                       type: string
 *                     correoElectronico:
 *                       type: string
 *                       format: email
 *                     nombreUsuario:
 *                       type: string
 *                     areaId:
 *                       type: string
 *                       format: uuid
 *                     activo:
 *                       type: boolean
 *                     fotoUrl:
 *                       type: string
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token inválido o expirado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/me", getMe);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     description: Autentica un usuario usando nombre de usuario, correo electrónico o documento y devuelve un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contrasena
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario, correo electrónico o número de documento
 *                 example: juan.perez
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *                 example: 123456
 *           examples:
 *             conUsuario:
 *               summary: Login con nombre de usuario
 *               value:
 *                 usuario: juan.perez
 *                 contrasena: 123456
 *             conEmail:
 *               summary: Login con correo electrónico
 *               value:
 *                 usuario: juan.perez@example.com
 *                 contrasena: 123456
 *             conDocumento:
 *               summary: Login con número de documento
 *               value:
 *                 usuario: "12345678"
 *                 contrasena: 123456
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login exitoso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     documento:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     segundoNombre:
 *                       type: string
 *                     primerApellido:
 *                       type: string
 *                     segundoApellido:
 *                       type: string
 *                     correoElectronico:
 *                       type: string
 *                       format: email
 *                     nombreUsuario:
 *                       type: string
 *                     areaId:
 *                       type: string
 *                       format: uuid
 *                     activo:
 *                       type: boolean
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación (válido por 24 horas)
 *                 refreshToken:
 *                   type: string
 *                   description: Token para renovar el access token (válido por 7 días)
 *                 expiresIn:
 *                   type: string
 *                   example: 24h
 *       400:
 *         description: Campos obligatorios faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario/Email/Documento y contraseña son obligatorios
 *       401:
 *         description: Credenciales inválidas o usuario inactivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
 *     description: Crea una nueva cuenta de usuario en el sistema. El campo documento debe ser numérico.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documento
 *               - nombre
 *               - primerApellido
 *               - correoElectronico
 *               - nombreUsuario
 *               - contrasena
 *             properties:
 *               documento:
 *                 type: integer
 *                 description: Número de documento del usuario (solo números, sin puntos ni guiones)
 *                 example: 12345678
 *               nombre:
 *                 type: string
 *                 description: Primer nombre del usuario
 *                 example: Juan
 *               segundoNombre:
 *                 type: string
 *                 description: Segundo nombre del usuario (opcional)
 *                 example: Carlos
 *               primerApellido:
 *                 type: string
 *                 description: Primer apellido del usuario
 *                 example: Pérez
 *               segundoApellido:
 *                 type: string
 *                 description: Segundo apellido del usuario (opcional)
 *                 example: García
 *               correoElectronico:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *                 example: juan.perez@example.com
 *               nombreUsuario:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 example: juan.perez
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 description: Contraseña (mínimo 6 caracteres)
 *                 example: 123456
 *               areaId:
 *                 type: string
 *                 format: uuid
 *                 description: ID del área a la que pertenece el usuario (opcional)
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario registrado exitosamente
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     documento:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     segundoNombre:
 *                       type: string
 *                     primerApellido:
 *                       type: string
 *                     segundoApellido:
 *                       type: string
 *                     correoElectronico:
 *                       type: string
 *                       format: email
 *                     nombreUsuario:
 *                       type: string
 *                     areaId:
 *                       type: string
 *                       format: uuid
 *                     activo:
 *                       type: boolean
 *       400:
 *         description: Campos obligatorios faltantes o formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Faltan campos obligatorios
 *       409:
 *         description: Usuario, email o documento ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El nombre de usuario ya existe
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Renovar token de acceso
 *     tags: [Autenticación]
 *     description: Genera un nuevo access token usando el refresh token cuando el token actual ha expirado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token obtenido al hacer login
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token renovado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token renovado exitosamente
 *                 token:
 *                   type: string
 *                   description: Nuevo access token JWT
 *                 expiresIn:
 *                   type: string
 *                   example: 24h
 *       400:
 *         description: Refresh token no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token requerido
 *       401:
 *         description: Refresh token inválido, expirado o usuario no válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token inválido o expirado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar restablecimiento de contraseña
 *     tags: [Autenticación]
 *     description: Envía un correo con instrucciones para restablecer la contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@sgc.com
 *     responses:
 *       200:
 *         description: Correo enviado exitosamente
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
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablecer contraseña
 *     tags: [Autenticación]
 *     description: Restablece la contraseña usando el token enviado por correo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token recibido por correo
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Autenticación]
 *     description: Cierra la sesión del usuario (el token se invalida en el cliente)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout exitoso. Token invalidado en el cliente.
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verificar token
 *     tags: [Autenticación]
 *     description: Verifica si el token JWT actual es válido y devuelve información del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     nombreUsuario:
 *                       type: string
 *       401:
 *         description: Token no proporcionado, inválido, expirado o usuario inactivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token inválido o expirado
 *                 valid:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.get("/verify", verifyToken);

export default router;
