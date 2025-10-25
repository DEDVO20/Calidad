import { Router } from 'express';
import {
    crearAuditoria,
    listarAuditorias,
    obtenerAuditoria,
    actualizarAuditoria,
    eliminarAuditoria
} from '../controllers/auditoria.controller';

const router = Router();

/**
 * @swagger
 * /api/auditoria:
 *   post:
 *     summary: Crear nueva auditoría (alternativo)
 *     tags: [Auditorías]
 *     description: Endpoint alternativo para crear auditorías
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
 *               - tipo
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: AUD-2024-002
 *               tipo:
 *                 type: string
 *                 enum: [interna, externa, certificacion]
 *               estado:
 *                 type: string
 *                 enum: [planificada, en_curso, completada, cancelada]
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *               alcance:
 *                 type: string
 *               criterios:
 *                 type: string
 *     responses:
 *       201:
 *         description: Auditoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auditoria'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', crearAuditoria);

/**
 * @swagger
 * /api/auditoria:
 *   get:
 *     summary: Listar todas las auditorías (alternativo)
 *     tags: [Auditorías]
 *     description: Endpoint alternativo para listar auditorías
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de auditorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auditoria'
 */
router.get('/', listarAuditorias);

/**
 * @swagger
 * /api/auditoria/{id}:
 *   get:
 *     summary: Obtener auditoría por ID (alternativo)
 *     tags: [Auditorías]
 *     description: Endpoint alternativo para obtener una auditoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la auditoría
 *     responses:
 *       200:
 *         description: Detalles de la auditoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auditoria'
 *       404:
 *         description: Auditoría no encontrada
 */
router.get('/:id', obtenerAuditoria);

/**
 * @swagger
 * /api/auditoria/{id}:
 *   put:
 *     summary: Actualizar auditoría (alternativo)
 *     tags: [Auditorías]
 *     description: Endpoint alternativo para actualizar una auditoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [planificada, en_curso, completada, cancelada]
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Auditoría actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auditoria'
 */
router.put('/:id', actualizarAuditoria);

/**
 * @swagger
 * /api/auditoria/{id}:
 *   delete:
 *     summary: Eliminar auditoría (alternativo)
 *     tags: [Auditorías]
 *     description: Endpoint alternativo para eliminar una auditoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Auditoría eliminada exitosamente
 */
router.delete('/:id', eliminarAuditoria);

export default router;