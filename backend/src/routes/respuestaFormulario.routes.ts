import { Router } from "express";
import {
  createRespuestaFormulario,
  getRespuestaFormularioById,
  updateRespuestaFormulario,
  deleteRespuestaFormulario,
  getRespuestasByInstancia,
  getAllRespuestasFormulario,
} from "../controllers/respuestaFormulario.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

/**
 * @swagger
 * /api/respuestas-formulario:
 *   post:
 *     summary: Crear una nueva respuesta de formulario
 *     tags: [RespuestasFormulario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - instanciaId
 *               - campoId
 *             properties:
 *               instanciaId:
 *                 type: string
 *                 format: uuid
 *                 description: ID de la instancia del proceso
 *               campoId:
 *                 type: string
 *                 format: uuid
 *                 description: ID del campo del formulario
 *               valor:
 *                 type: string
 *                 description: Valor de la respuesta
 *     responses:
 *       201:
 *         description: Respuesta de formulario creada exitosamente
 *       500:
 *         description: Error al crear la respuesta del formulario
 */
router.post("/", createRespuestaFormulario);

/**
 * @swagger
 * /api/respuestas-formulario:
 *   get:
 *     summary: Obtener todas las respuestas de formularios
 *     tags: [RespuestasFormulario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las respuestas de formularios
 *       500:
 *         description: Error al obtener las respuestas del formulario
 */
router.get("/", getAllRespuestasFormulario);

/**
 * @swagger
 * /api/respuestas-formulario/{id}:
 *   get:
 *     summary: Obtener una respuesta de formulario por ID
 *     tags: [RespuestasFormulario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la respuesta del formulario
 *     responses:
 *       200:
 *         description: Respuesta del formulario encontrada
 *       404:
 *         description: Respuesta del formulario no encontrada
 *       500:
 *         description: Error al obtener la respuesta del formulario
 */
router.get("/:id", getRespuestaFormularioById);

/**
 * @swagger
 * /api/respuestas-formulario/instancia/{instanciaId}:
 *   get:
 *     summary: Obtener todas las respuestas de una instancia específica
 *     tags: [RespuestasFormulario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: instanciaId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la instancia del proceso
 *     responses:
 *       200:
 *         description: Lista de respuestas de la instancia
 *       500:
 *         description: Error al obtener las respuestas de la instancia
 */
router.get("/instancia/:instanciaId", getRespuestasByInstancia);

/**
 * @swagger
 * /api/respuestas-formulario/{id}:
 *   put:
 *     summary: Actualizar una respuesta de formulario
 *     tags: [RespuestasFormulario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la respuesta del formulario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instanciaId:
 *                 type: string
 *                 format: uuid
 *                 description: ID de la instancia del proceso
 *               campoId:
 *                 type: string
 *                 format: uuid
 *                 description: ID del campo del formulario
 *               valor:
 *                 type: string
 *                 description: Valor de la respuesta
 *     responses:
 *       200:
 *         description: Respuesta de formulario actualizada exitosamente
 *       404:
 *         description: Respuesta del formulario no encontrada
 *       500:
 *         description: Error al actualizar la respuesta del formulario
 */
router.put("/:id", updateRespuestaFormulario);

/**
 * @swagger
 * /api/respuestas-formulario/{id}:
 *   delete:
 *     summary: Eliminar una respuesta de formulario
 *     tags: [RespuestasFormulario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la respuesta del formulario
 *     responses:
 *       200:
 *         description: Respuesta del formulario eliminada correctamente
 *       404:
 *         description: Respuesta del formulario no encontrada
 *       500:
 *         description: Error al eliminar la respuesta del formulario
 */
router.delete("/:id", deleteRespuestaFormulario);

export default router;
