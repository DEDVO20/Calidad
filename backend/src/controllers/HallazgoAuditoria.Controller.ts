import { Request, Response } from "express";
import HallazgoAuditoria from "../models/hallazgoAuditoria.model";

/** Crear Hallazgo de Auditoría */
export const createHallazgoAuditoria = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    if (!payload.auditoriaId) {
      return res.status(400).json({ message: "El campo 'auditoriaId' es obligatorio." });
    }

    const hallazgo = await HallazgoAuditoria.create(payload);
    return res.status(201).json(hallazgo);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear el hallazgo", error: error.message });
  }
};

/** Listar todos los Hallazgos de Auditoría */
export const getHallazgosAuditoria = async (_req: Request, res: Response) => {
  try {
    const hallazgos = await HallazgoAuditoria.findAll({
      order: [["creadoEn", "DESC"]],
    });
    return res.json(hallazgos);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener hallazgos", error: error.message });
  }
};

/** Obtener Hallazgo de Auditoría por ID */
export const getHallazgoAuditoriaById = async (req: Request, res: Response) => {
  try {
    const hallazgo = await HallazgoAuditoria.findByPk(req.params.id);
    if (!hallazgo) return res.status(404).json({ message: "Hallazgo no encontrado" });
    return res.json(hallazgo);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener el hallazgo", error: error.message });
  }
};

/** Actualizar Hallazgo de Auditoría por ID */
export const updateHallazgoAuditoria = async (req: Request, res: Response) => {
  try {
    const hallazgo = await HallazgoAuditoria.findByPk(req.params.id);
    if (!hallazgo) return res.status(404).json({ message: "Hallazgo no encontrado" });

    const payload = req.body ?? {};
    await hallazgo.update(payload);
    return res.json(hallazgo);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar el hallazgo", error: error.message });
  }
};

/** Eliminar Hallazgo de Auditoría por ID */
export const deleteHallazgoAuditoria = async (req: Request, res: Response) => {
  try {
    const hallazgo = await HallazgoAuditoria.findByPk(req.params.id);
    if (!hallazgo) return res.status(404).json({ message: "Hallazgo no encontrado" });

    await hallazgo.destroy();
    return res.status(204).send();
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el hallazgo", error: error.message });
  }
};