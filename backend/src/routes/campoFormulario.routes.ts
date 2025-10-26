import { Router } from "express";
import {
  createCampoFormulario,
  getCamposFormulario,
  getCampoFormularioById,
  updateCampoFormulario,
} from "../controllers/campoFormulario.controller";

const router = Router();

/**
 * @swagger
 * /api/campos-formulario:
 *   post:
 *     summary: Crear campo de formulario
 *     tags: [Campos de Formulario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [texto, numero, fecha, seleccion, checkbox]
 *               requerido:
 *                 type: boolean
 *               opciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campo creado
 *       401:
 *         description: No autorizado
 */
router.post("/", createCampoFormulario);

/**
 * @swagger
 * /api/campos-formulario:
 *   get:
 *     summary: Listar campos de formulario
 *     tags: [Campos de Formulario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de campos
 *       401:
 *         description: No autorizado
 */
router.get("/", getCamposFormulario);

/**
 * @swagger
 * /api/campos-formulario/{id}:
 *   get:
 *     summary: Obtener campo por ID
 *     tags: [Campos de Formulario]
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
 *         description: Detalles
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", getCampoFormularioById);

/**
 * @swagger
 * /api/campos-formulario/{id}:
 *   put:
 *     summary: Actualizar campo
 *     tags: [Campos de Formulario]
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
 *     responses:
 *       200:
 *         description: Actualizado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updateCampoFormulario);

export default router;