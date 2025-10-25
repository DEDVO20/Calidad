import { Router } from "express";
import {
  createhallazgoAuditoria,
  gethallazgosAuditoria,
  gethallazgoAuditoriaById,
  updatehallazgoAuditoria,
  deletehallazgoAuditoria,
} from "../controllers/hallazgoAuditoria.controller";

const router = Router();

/**
 * @swagger
 * /api/hallazgos-auditoria:
 *   post:
 *     summary: Crear nuevo hallazgo de auditoría
 *     tags: [Hallazgos de Auditoría]
 *     description: Registra un nuevo hallazgo detectado durante una auditoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auditoriaId
 *               - descripcion
 *               - tipo
 *             properties:
 *               auditoriaId:
 *                 type: integer
 *                 description: ID de la auditoría asociada
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: Falta de documentación del proceso de compras
 *               tipo:
 *                 type: string
 *                 enum: [no_conformidad_mayor, no_conformidad_menor, observacion, oportunidad_mejora]
 *                 example: no_conformidad_menor
 *               severidad:
 *                 type: string
 *                 enum: [baja, media, alta, critica]
 *                 example: media
 *               estado:
 *                 type: string
 *                 enum: [abierto, en_tratamiento, cerrado, verificado]
 *                 default: abierto
 *               evidencia:
 *                 type: string
 *                 example: Registros fotográficos del área
 *               fechaDeteccion:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Hallazgo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HallazgoAuditoria'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", createhallazgoAuditoria);

/**
 * @swagger
 * /api/hallazgos-auditoria:
 *   get:
 *     summary: Obtener todos los hallazgos de auditoría
 *     tags: [Hallazgos de Auditoría]
 *     description: Lista todos los hallazgos registrados con filtros opcionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: auditoriaId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de auditoría
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [no_conformidad_mayor, no_conformidad_menor, observacion, oportunidad_mejora]
 *         description: Filtrar por tipo de hallazgo
 *       - in: query
 *         name: severidad
 *         schema:
 *           type: string
 *           enum: [baja, media, alta, critica]
 *         description: Filtrar por severidad
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [abierto, en_tratamiento, cerrado, verificado]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de hallazgos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HallazgoAuditoria'
 *       401:
 *         description: No autorizado
 */
router.get("/", gethallazgosAuditoria);

/**
 * @swagger
 * /api/hallazgos-auditoria/{id}:
 *   get:
 *     summary: Obtener hallazgo por ID
 *     tags: [Hallazgos de Auditoría]
 *     description: Obtiene los detalles de un hallazgo específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del hallazgo
 *     responses:
 *       200:
 *         description: Detalles del hallazgo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HallazgoAuditoria'
 *       404:
 *         description: Hallazgo no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", gethallazgoAuditoriaById);

/**
 * @swagger
 * /api/hallazgos-auditoria/{id}:
 *   put:
 *     summary: Actualizar hallazgo de auditoría
 *     tags: [Hallazgos de Auditoría]
 *     description: Actualiza la información de un hallazgo existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del hallazgo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [no_conformidad_mayor, no_conformidad_menor, observacion, oportunidad_mejora]
 *               severidad:
 *                 type: string
 *                 enum: [baja, media, alta, critica]
 *               estado:
 *                 type: string
 *                 enum: [abierto, en_tratamiento, cerrado, verificado]
 *               evidencia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hallazgo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HallazgoAuditoria'
 *       404:
 *         description: Hallazgo no encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updatehallazgoAuditoria);

/**
 * @swagger
 * /api/hallazgos-auditoria/{id}:
 *   delete:
 *     summary: Eliminar hallazgo de auditoría
 *     tags: [Hallazgos de Auditoría]
 *     description: Elimina un hallazgo del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del hallazgo
 *     responses:
 *       200:
 *         description: Hallazgo eliminado exitosamente
 *       404:
 *         description: Hallazgo no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deletehallazgoAuditoria);

export default router;
