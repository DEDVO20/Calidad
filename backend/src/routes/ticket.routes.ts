import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  getTicketsByEstado,
  getTicketsByUsuario,
  getTicketsAsignados,
  getTicketsByInstancia,
  updateTicket,
  asignarTicket,
  resolverTicket,
  deleteTicket,
} from "../controllers/ticket.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Crear un nuevo ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - creadoPor
 *               - descripcion
 *             properties:
 *               instanciaId:
 *                 type: string
 *                 format: uuid
 *               creadoPor:
 *                 type: string
 *                 format: uuid
 *               AsignadoA:
 *                 type: string
 *                 format: uuid
 *               estado:
 *                 type: string
 *                 enum: [abierto, en_proceso, resuelto, cerrado]
 *               descripcion:
 *                 type: string
 *               solucion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket creado exitosamente
 *       500:
 *         description: Error al crear el ticket
 */
router.post("/", createTicket);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Obtener todos los tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tickets
 *       500:
 *         description: Error al obtener los tickets
 */
router.get("/", getAllTickets);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Obtener un ticket por ID
 *     tags: [Tickets]
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
 *         description: Ticket encontrado
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error al obtener el ticket
 */
router.get("/:id", getTicketById);

/**
 * @swagger
 * /api/tickets/estado/{estado}:
 *   get:
 *     summary: Obtener tickets por estado
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [abierto, en_proceso, resuelto, cerrado]
 *     responses:
 *       200:
 *         description: Lista de tickets filtrados por estado
 *       500:
 *         description: Error al obtener tickets
 */
router.get("/estado/:estado", getTicketsByEstado);

/**
 * @swagger
 * /api/tickets/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener tickets creados por un usuario
 *     tags: [Tickets]
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
 *         description: Lista de tickets del usuario
 *       500:
 *         description: Error al obtener tickets
 */
router.get("/usuario/:usuarioId", getTicketsByUsuario);

/**
 * @swagger
 * /api/tickets/asignados/{usuarioId}:
 *   get:
 *     summary: Obtener tickets asignados a un usuario
 *     tags: [Tickets]
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
 *         description: Lista de tickets asignados
 *       500:
 *         description: Error al obtener tickets
 */
router.get("/asignados/:usuarioId", getTicketsAsignados);

/**
 * @swagger
 * /api/tickets/instancia/{instanciaId}:
 *   get:
 *     summary: Obtener tickets de una instancia de proceso
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: instanciaId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de tickets de la instancia
 *       500:
 *         description: Error al obtener tickets
 */
router.get("/instancia/:instanciaId", getTicketsByInstancia);

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Actualizar un ticket
 *     tags: [Tickets]
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
 *               instanciaId:
 *                 type: string
 *                 format: uuid
 *               creadoPor:
 *                 type: string
 *                 format: uuid
 *               AsignadoA:
 *                 type: string
 *                 format: uuid
 *               estado:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               solucion:
 *                 type: string
 *               resueltoEn:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Ticket actualizado exitosamente
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error al actualizar el ticket
 */
router.put("/:id", updateTicket);

/**
 * @swagger
 * /api/tickets/{id}/asignar:
 *   patch:
 *     summary: Asignar un ticket a un usuario
 *     tags: [Tickets]
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
 *             required:
 *               - AsignadoA
 *             properties:
 *               AsignadoA:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Ticket asignado exitosamente
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error al asignar el ticket
 */
router.patch("/:id/asignar", asignarTicket);

/**
 * @swagger
 * /api/tickets/{id}/resolver:
 *   patch:
 *     summary: Resolver un ticket
 *     tags: [Tickets]
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
 *             required:
 *               - solucion
 *             properties:
 *               solucion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket resuelto exitosamente
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error al resolver el ticket
 */
router.patch("/:id/resolver", resolverTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Eliminar un ticket
 *     tags: [Tickets]
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
 *         description: Ticket eliminado exitosamente
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error al eliminar el ticket
 */
router.delete("/:id", deleteTicket);

export default router;
