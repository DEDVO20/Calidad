import { Request, Response } from "express";
import Notificacion from "../models/notificacion.model";

/** Crear notificación */
export const createNotificacion = async (req: Request, res: Response) => {
  try {
    const { usuarioId, tipo, contenido } = req.body;

    if (!usuarioId || !tipo) {
      return res
        .status(400)
        .json({ message: "Los campos 'usuarioId' y 'tipo' son obligatorios." });
    }

    const notif = await Notificacion.create({
      usuarioId,
      tipo,
      contenido,
      entregado: false,
    });

    return res.status(201).json(notif);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear la notificación.",
      error: error.message,
    });
  }
};

/** Listar todas las notificaciones (opcionalmente por usuario) */
export const getNotificaciones = async (req: Request, res: Response) => {
  try {
    const { usuarioId } = req.query;
    const where: any = {};
    if (usuarioId) where.usuarioId = usuarioId;

    const notifs = await Notificacion.findAll({
      where,
      order: [["creadoEn", "DESC"]],
    });

    return res.json(notifs);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener las notificaciones.",
      error: error.message,
    });
  }
};

/** Obtener una notificación por ID */
export const getNotificacionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByPk(id);

    if (!notificacion)
      return res.status(404).json({ message: "Notificación no encontrada." });

    return res.json(notificacion);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener la notificación.",
      error: error.message,
    });
  }
};

/** Marcar notificación como leída */
export const marcarComoLeida = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByPk(id);

    if (!notificacion) {
      return res.status(404).json({ message: "Notificación no encontrada." });
    }

    await notificacion.update({
      entregado: true,
      entregadoEn: new Date(),
    });

    return res.json({
      message: "Notificación marcada como leída.",
      notificacion,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al marcar la notificación como leída.",
      error: error.message,
    });
  }
};

/** Eliminar una notificación */
export const deleteNotificacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByPk(id);

    if (!notificacion)
      return res.status(404).json({ message: "Notificación no encontrada." });

    await notificacion.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al eliminar la notificación.",
      error: error.message,
    });
  }
};
