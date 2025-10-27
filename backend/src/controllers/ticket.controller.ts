import { Request, Response } from "express";
import Ticket from "../models/tickets.model";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const {
      instanciaId,
      creadoPor,
      AsignadoA,
      estado,
      descripcion,
      solucion,
    } = req.body;

    const ticket = await Ticket.create({
      instanciaId,
      creadoPor,
      AsignadoA,
      estado,
      descripcion,
      solucion,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el ticket", error });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tickets", error });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el ticket", error });
  }
};

export const getTicketsByEstado = async (req: Request, res: Response) => {
  try {
    const { estado } = req.params;
    const tickets = await Ticket.findAll({
      where: { estado },
    });
    res.status(200).json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener tickets por estado", error });
  }
};

export const getTicketsByUsuario = async (req: Request, res: Response) => {
  try {
    const { usuarioId } = req.params;
    const tickets = await Ticket.findAll({
      where: { creadoPor: usuarioId },
    });
    res.status(200).json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener tickets del usuario", error });
  }
};

export const getTicketsAsignados = async (req: Request, res: Response) => {
  try {
    const { usuarioId } = req.params;
    const tickets = await Ticket.findAll({
      where: { AsignadoA: usuarioId },
    });
    res.status(200).json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener tickets asignados", error });
  }
};

export const getTicketsByInstancia = async (req: Request, res: Response) => {
  try {
    const { instanciaId } = req.params;
    const tickets = await Ticket.findAll({
      where: { instanciaId },
    });
    res.status(200).json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener tickets de la instancia", error });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      instanciaId,
      creadoPor,
      AsignadoA,
      estado,
      descripcion,
      solucion,
      resueltoEn,
    } = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    await ticket.update({
      instanciaId,
      creadoPor,
      AsignadoA,
      estado,
      descripcion,
      solucion,
      resueltoEn,
    });

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el ticket", error });
  }
};

export const asignarTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { AsignadoA } = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    await ticket.update({ AsignadoA });

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error al asignar el ticket", error });
  }
};

export const resolverTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { solucion } = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    await ticket.update({
      solucion,
      estado: "resuelto",
      resueltoEn: new Date(),
    });

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error al resolver el ticket", error });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    await ticket.destroy();
    res.status(200).json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el ticket", error });
  }
};
