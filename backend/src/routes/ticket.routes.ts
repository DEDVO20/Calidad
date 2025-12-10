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

// POST /api/
router.post("/", createTicket);

// GET /api/
router.get("/", getAllTickets);

// GET /api/:id
router.get("/:id", getTicketById);

// GET /api/estado/:estado
router.get("/estado/:estado", getTicketsByEstado);

// GET /api/usuario/:usuarioId
router.get("/usuario/:usuarioId", getTicketsByUsuario);

// GET /api/asignados/:usuarioId
router.get("/asignados/:usuarioId", getTicketsAsignados);

// GET /api/instancia/:instanciaId
router.get("/instancia/:instanciaId", getTicketsByInstancia);

// PUT /api/:id
router.put("/:id", updateTicket);

// PATCH /api/:id/asignar
router.patch("/:id/asignar", asignarTicket);

// PATCH /api/:id/resolver
router.patch("/:id/resolver", resolverTicket);

// DELETE /api/:id
router.delete("/:id", deleteTicket);

export default router;
