import { Request, Response } from "express";
import Notificacion from "../models/notificacion.model";

/** Crear notificación */
export const createNotificacion = async (req: Request, res: Response) => {
  try {
    const { titulo, mensaje, usuarioId } = req.body;

    if (!titulo || !mensaje || !usuarioId) {
      return res
        .status(400)
        .json({ message: "Los campos 'titulo', 'mensaje' y 'usuarioId' son obligatorios." });
    }

    const nueva = await Notificacion.create({
      titulo,
      mensaje,
      usuarioId,
    });

    return res.status(201).json(nueva);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al crear la notificación", error: error.message });
  }
};

/** Listar todas las notificaciones */
export const getNotificaciones = async (req: Request, res: Response) => {
  try {
    const lista = await Notificacion.findAll({
      order: [["fechaEnvio", "DESC"]],
    });
    return res.json(lista);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener las notificaciones", error: error.message });
  }
};

/** Obtener notificación por ID */
export const getNotificacionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByPk(id);

    if (!notificacion)
      return res.status(404).json({ message: "Notificación no encontrada." });

    return res.json(notificacion);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener la notificación", error: error.message });
  }
};

/** Marcar notificación como leída */
export const marcarComoLeida = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByPk(id);

    if (!notificacion)
      return res.status(404).json({ message: "Notificación no encontrada." });

    await notificacion.update({ leida: true });
    return res.json({ message: "Notificación marcada como leída", notificacion });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al actualizar la notificación", error: error.message });
  }
};

/** Eliminar notificación */
export const deleteNotificacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByPk(id);

    if (!notificacion)
      return res.status(404).json({ message: "Notificación no encontrada." });

    await notificacion.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al eliminar la notificación", error: error.message });
  }
};
