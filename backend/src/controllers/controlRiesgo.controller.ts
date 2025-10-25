import { Request, Response } from "express";
import ControlRiesgo from "../models/ControlRiesgo.model";

/** Crear Control de Riesgo */
export const createControlRiesgo = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    if (!payload.riesgoId) {
      return res.status(400).json({ message: "El campo 'riesgoId' es obligatorio." });
    }

    const control = await ControlRiesgo.create(payload);
    return res.status(201).json(control);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear el control de riesgo", error: error.message });
  }
};

/** Listar todos los Controles de Riesgo */
export const getControlesRiesgo = async (_req: Request, res: Response) => {
  try {
    const controles = await ControlRiesgo.findAll({
      order: [["creadoEn", "DESC"]],
    });
    return res.json(controles);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener controles de riesgo", error: error.message });
  }
};

/** Obtener Control de Riesgo por ID */
export const getControlRiesgoById = async (req: Request, res: Response) => {
  try {
    const control = await ControlRiesgo.findByPk(req.params.id);
    if (!control) return res.status(404).json({ message: "Control de riesgo no encontrado" });
    return res.json(control);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener el control de riesgo", error: error.message });
  }
};

/** Actualizar Control de Riesgo por ID */
export const updateControlRiesgo = async (req: Request, res: Response) => {
  try {
    const control = await ControlRiesgo.findByPk(req.params.id);
    if (!control) return res.status(404).json({ message: "Control de riesgo no encontrado" });

    const payload = req.body ?? {};
    await control.update(payload);
    return res.json(control);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar el control de riesgo", error: error.message });
  }
};

/** Eliminar Control de Riesgo por ID */
export const deleteControlRiesgo = async (req: Request, res: Response) => {
  try {
    const control = await ControlRiesgo.findByPk(req.params.id);
    if (!control) return res.status(404).json({ message: "Control de riesgo no encontrado" });

    await control.destroy();
    return res.status(204).send();
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el control de riesgo", error: error.message });
  }
};