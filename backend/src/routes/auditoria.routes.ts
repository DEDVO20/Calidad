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
 *     summary: Crear registro de auditoría del sistema
 *     tags: [Auditoría de Sistema]
 *     description: Crea un registro de auditoría para tracking de acciones del sistema
 *     security:
 *       - bearerAuth: []
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
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               tipoEntidad:
 *                 type: string
 *                 example: Usuario
 *               entidadId:
 *                 type: string
 *                 format: uuid
 *               accion:
 *                 type: string
 *                 enum: [crear, actualizar, eliminar, leer]
 *                 example: crear
 *               detalles:
 *                 type: object
 *                 example: { "campo": "nombre", "valorAnterior": "Juan", "valorNuevo": "Pedro" }
 *     responses:
 *       201:
 *         description: Registro de auditoría creado
 *       400:
 *         description: Cuerpo vacío
 *       401:
 *         description: No autorizado
 */
router.post('/', crearAuditoria);

/**
 * @swagger
 * /api/auditoria:
 *   get:
 *     summary: Listar registros de auditoría del sistema
 *     tags: [Auditoría de Sistema]
 *     description: Obtiene todos los registros de auditoría del sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros de auditoría
 *       401:
 *         description: No autorizado
 */
router.get('/', listarAuditorias);

/**
 * @swagger
 * /api/auditoria/{id}:
 *   get:
 *     summary: Obtener registro de auditoría por ID
 *     tags: [Auditoría de Sistema]
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
 *         description: Detalles del registro
 *       404:
 *         description: Registro no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id', obtenerAuditoria);

/**
 * @swagger
 * /api/auditoria/{id}:
 *   put:
 *     summary: Actualizar registro de auditoría
 *     tags: [Auditoría de Sistema]
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
 *         description: Registro actualizado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.put('/:id', actualizarAuditoria);

/**
 * @swagger
 * /api/auditoria/{id}:
 *   delete:
 *     summary: Eliminar registro de auditoría
 *     tags: [Auditoría de Sistema]
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
 *       204:
 *         description: Registro eliminado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.delete('/:id', eliminarAuditoria);

export default router;