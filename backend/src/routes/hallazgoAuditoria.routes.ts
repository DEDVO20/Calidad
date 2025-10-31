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
 *     summary: Crear hallazgo de auditoría
 *     tags: [Hallazgos de Auditoría]
 *     description: Registra un hallazgo detectado durante una auditoría
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
 *             properties:
 *               auditoriaId:
 *                 type: string
 *                 format: uuid
 *               descripcion:
 *                 type: string
 *                 example: Falta de registros de capacitación del personal
 *               tipo:
 *                 type: string
 *                 enum: [no_conformidad_mayor, no_conformidad_menor, observacion, oportunidad_mejora]
 *                 example: no_conformidad_menor
 *               severidad:
 *                 type: string
 *                 enum: [baja, media, alta, critica]
 *                 example: media
 *               clausulaISO:
 *                 type: string
 *                 example: 7.2 Competencia
 *               evidencia:
 *                 type: string
 *               areaAfectadaId:
 *                 type: string
 *                 format: uuid
 *               responsableId:
 *                 type: string
 *                 format: uuid
 *               fechaDeteccion:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *                 enum: [abierto, en_tratamiento, cerrado, verificado]
 *                 default: abierto
 *     responses:
 *       201:
 *         description: Hallazgo creado
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
 *     summary: Listar hallazgos de auditoría
 *     tags: [Hallazgos de Auditoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: auditoriaId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por auditoría
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [no_conformidad_mayor, no_conformidad_menor, observacion, oportunidad_mejora]
 *       - in: query
 *         name: severidad
 *         schema:
 *           type: string
 *           enum: [baja, media, alta, critica]
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [abierto, en_tratamiento, cerrado, verificado]
 *     responses:
 *       200:
 *         description: Lista de hallazgos
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
 *         description: Detalles del hallazgo
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
 *     summary: Actualizar hallazgo
 *     tags: [Hallazgos de Auditoría]
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
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [abierto, en_tratamiento, cerrado, verificado]
 *               accionCorrectiva:
 *                 type: string
 *               fechaCierre:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Hallazgo actualizado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", updatehallazgoAuditoria);

/**
 * @swagger
 * /api/hallazgos-auditoria/{id}:
 *   delete:
 *     summary: Eliminar hallazgo
 *     tags: [Hallazgos de Auditoría]
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
 *         description: Hallazgo eliminado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", deletehallazgoAuditoria);

export default router;
