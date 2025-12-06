import { Request, Response } from "express";
import Notificacion from "../models/notificacion.model";
import { Op } from "sequelize";

/**
 * Obtener todas las notificaciones del usuario autenticado
 */
export const getNotificaciones = async (req: Request, res: Response) => {
    try {
        const usuarioId = (req as any).user?.id;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const { leida, limite = 50 } = req.query;

        const where: any = { usuarioId };

        // Filtrar por estado de lectura si se especifica
        if (leida !== undefined) {
            where.leida = leida === "true";
        }

        const notificaciones = await Notificacion.findAll({
            where,
            order: [["creadoEn", "DESC"]],
            limit: parseInt(limite as string),
        });

        return res.json({
            total: notificaciones.length,
            items: notificaciones,
        });
    } catch (error: any) {
        console.error("Error al obtener notificaciones:", error);
        return res.status(500).json({
            message: "Error al obtener notificaciones",
            error: error.message,
        });
    }
};

/**
 * Contar notificaciones no leídas
 */
export const getNotificacionesNoLeidasCount = async (
    req: Request,
    res: Response
) => {
    try {
        const usuarioId = (req as any).user?.id;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const count = await Notificacion.count({
            where: {
                usuarioId,
                leida: false,
            },
        });

        return res.json({ count });
    } catch (error: any) {
        console.error("Error al contar notificaciones no leídas:", error);
        return res.status(500).json({
            message: "Error al contar notificaciones",
            error: error.message,
        });
    }
};

/**
 * Marcar una notificación como leída
 */
export const marcarComoLeida = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = (req as any).user?.id;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const notificacion = await Notificacion.findOne({
            where: { id, usuarioId },
        });

        if (!notificacion) {
            return res.status(404).json({ message: "Notificación no encontrada" });
        }

        if (notificacion.leida) {
            return res.json({
                message: "La notificación ya está marcada como leída",
                notificacion,
            });
        }

        await notificacion.update({
            leida: true,
            fechaLectura: new Date(),
        });

        return res.json({
            message: "Notificación marcada como leída",
            notificacion,
        });
    } catch (error: any) {
        console.error("Error al marcar notificación como leída:", error);
        return res.status(500).json({
            message: "Error al actualizar notificación",
            error: error.message,
        });
    }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const marcarTodasComoLeidas = async (req: Request, res: Response) => {
    try {
        const usuarioId = (req as any).user?.id;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const [updated] = await Notificacion.update(
            {
                leida: true,
                fechaLectura: new Date(),
            },
            {
                where: {
                    usuarioId,
                    leida: false,
                },
            }
        );

        return res.json({
            message: `${updated} notificaciones marcadas como leídas`,
            count: updated,
        });
    } catch (error: any) {
        console.error("Error al marcar todas las notificaciones como leídas:", error);
        return res.status(500).json({
            message: "Error al actualizar notificaciones",
            error: error.message,
        });
    }
};

/**
 * Eliminar una notificación
 */
export const eliminarNotificacion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = (req as any).user?.id;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const notificacion = await Notificacion.findOne({
            where: { id, usuarioId },
        });

        if (!notificacion) {
            return res.status(404).json({ message: "Notificación no encontrada" });
        }

        await notificacion.destroy();

        return res.json({
            message: "Notificación eliminada exitosamente",
        });
    } catch (error: any) {
        console.error("Error al eliminar notificación:", error);
        return res.status(500).json({
            message: "Error al eliminar notificación",
            error: error.message,
        });
    }
};
