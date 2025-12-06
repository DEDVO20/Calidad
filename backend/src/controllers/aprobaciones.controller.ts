import { Request, Response } from "express";
import Documento from "../models/documento.model";
import Usuario from "../models/usuario.model";

/** Obtener documentos pendientes de aprobación */
export const getDocumentosPendientes = async (req: Request, res: Response) => {
    try {
        const documentos = await Documento.findAll({
            where: { estado: "en_revision" }, // Estado correcto según el flujo
            order: [["creadoEn", "ASC"]], // Más antiguos primero
        });

        return res.json({
            total: documentos.length,
            items: documentos,
        });
    } catch (error: any) {
        console.error("Error al obtener documentos pendientes:", error);
        return res.status(500).json({
            message: "Error al obtener documentos pendientes",
            error: error.message,
        });
    }
};

/** Aprobar documento */
export const aprobarDocumento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { comentarios } = req.body;
        const userId = (req as any).user?.id;

        const doc = await Documento.findByPk(id);
        if (!doc) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        // Actualizar documento
        await doc.update({
            estado: "aprobado",
            aprobadoPor: userId,
            fechaAprobacion: new Date(),
            // Opcional: guardar comentarios de aprobación si se desea
        });

        return res.json({
            message: "Documento aprobado exitosamente",
            documento: doc,
        });
    } catch (error: any) {
        console.error("Error al aprobar documento:", error);
        return res.status(500).json({
            message: "Error al aprobar documento",
            error: error.message,
        });
    }
};

/** Rechazar documento */
export const rechazarDocumento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { comentarios } = req.body;
        const userId = (req as any).user?.id;

        // Validar que se incluyan comentarios
        if (!comentarios || comentarios.trim().length < 10) {
            return res.status(400).json({
                message: "Los comentarios son obligatorios y deben tener al menos 10 caracteres",
            });
        }

        const doc = await Documento.findByPk(id);
        if (!doc) {
            return res.status(404).json({ message: "Documento no encontrado" });
        }

        // Actualizar documento
        await doc.update({
            estado: "borrador",
            rechazadoPor: userId,
            fechaRechazo: new Date(),
            comentariosRechazo: comentarios,
        });

        return res.json({
            message: "Documento rechazado. Devuelto a borrador.",
            documento: doc,
        });
    } catch (error: any) {
        console.error("Error al rechazar documento:", error);
        return res.status(500).json({
            message: "Error al rechazar documento",
            error: error.message,
        });
    }
};

/** Obtener aprobaciones del usuario actual */
export const getMisAprobaciones = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        // Documentos pendientes
        const pendientes = await Documento.findAll({
            where: { estado: "pendiente_aprobacion" },
        });

        // Documentos aprobados por mí
        const aprobados = await Documento.findAll({
            where: {
                aprobadoPor: userId,
                estado: "aprobado",
            },
            order: [["fechaAprobacion", "DESC"]],
            limit: 50,
        });

        // Documentos rechazados por mí
        const rechazados = await Documento.findAll({
            where: {
                rechazadoPor: userId,
            },
            order: [["fechaRechazo", "DESC"]],
            limit: 50,
        });

        return res.json({
            pendientes: {
                total: pendientes.length,
                items: pendientes,
            },
            aprobados: {
                total: aprobados.length,
                items: aprobados,
            },
            rechazados: {
                total: rechazados.length,
                items: rechazados,
            },
        });
    } catch (error: any) {
        console.error("Error al obtener mis aprobaciones:", error);
        return res.status(500).json({
            message: "Error al obtener aprobaciones",
            error: error.message,
        });
    }
};
