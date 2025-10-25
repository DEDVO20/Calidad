import { Request, Response } from "express";
import Notificacion from "../models/notificacion.model";

/** Crear notificación */
export const createNotificacion = async (req: Request, res: Response) => {
  try {
    const { usuarioId, tipo, contenido } = req.body;

    if (!usuarioId || !tipo) {
      return res.status(400).json({ message: "usuario_id y tipo son obligatorios." });
    }

    const notif = await Notificacion.create({
      usuarioId,
      tipo,
      contenido,
      entregado: false,
    });

    return res.status(201).json(notif);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al crear notificación", error: error.message });
  }
};

/** Listar notificaciones (opcionalmente por usuario_id) */
export const getNotificaciones = async (req: Request, res: Response) => {
  try {
    const { usuarioId } = req.query;
    const where: any = {};
    if (usuarioId) where.usuarioId = usuarioId;

    const notifs = await Notificacion.findAll({
      where,
      order: [["creado_en", "DESC"]],
    });

    return res.json(notifs);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al obtener notificaciones", error: error.message });
  }
};

/** Obtener una notificación por ID */
export const getNotificacionById = async (req: Request, res: Response) => {
  try {
    const notif = await Notificacion.findByPk(req.params.id);
    if (!notif) return res.status(404).json({ message: "Notificación no encontrada" });
    return res.json(notif);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al obtener la notificación", error: error.message });
  }
};

/** Actualizar notificación (título, contenido, entregado, etc.) */
export const updateNotificacion = async (req: Request, res: Response) => {
  try {
    const { tipo, contenido, entregado, entregadoEn } = req.body;
    const notif = await Notificacion.findByPk(req.params.id);
    if (!notif) return res.status(404).json({ message: "Notificación no encontrada" });

    await notif.update({
      tipo,
      contenido,
      entregado,
      entregadoEn,
    });

    return res.json(notif);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al actualizar la notificación", error: error.message });
  }
};
