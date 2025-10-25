import { Request, Response } from "express";
import Auditorias from "../models/auditorias.model";

/** Crear Auditoría */
export const createAuditoria = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "El cuerpo de la solicitud está vacío" });
    }

    const auditoria = await Auditorias.create(payload);
    return res.status(201).json(auditoria);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear la auditoría", error: error.message });
  }
};

/** Listar todas las Auditorías */
export const getAuditorias = async (_req: Request, res: Response) => {
  try {
    const auditorias = await Auditorias.findAll({
      order: [["creado_en", "DESC"]],
    });
    return res.json(auditorias);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener auditorías", error: error.message });
  }
};

/** Obtener Auditoría por ID */
export const getAuditoriaById = async (req: Request, res: Response) => {
  try {
    const auditoria = await Auditorias.findByPk(req.params.id);
    if (!auditoria) return res.status(404).json({ message: "Auditoría no encontrada" });
    return res.json(auditoria);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener la auditoría", error: error.message });
  }
};

/** Actualizar Auditoría por ID */
export const updateAuditoria = async (req: Request, res: Response) => {
  try {
    const auditoria = await Auditorias.findByPk(req.params.id);
    if (!auditoria) return res.status(404).json({ message: "Auditoría no encontrada" });

    const payload = req.body ?? {};
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "El cuerpo de la solicitud está vacío" });
    }

    await auditoria.update(payload);
    return res.json(auditoria);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar la auditoría", error: error.message });
  }
};

/** Eliminar Auditoría por ID */
export const deleteAuditoria = async (req: Request, res: Response) => {
  try {
    const auditoria = await Auditorias.findByPk(req.params.id);
    if (!auditoria) return res.status(404).json({ message: "Auditoría no encontrada" });

    await auditoria.destroy();
    return res.status(204).send();
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar la auditoría", error: error.message });
  }
};
