import { Request, Response } from "express";
import Riesgo from "../models/Riesgo.model";

/** Crear Riesgo */
export const createRiesgo = async (req: Request, res: Response) => {
  try {
    const payload = req.body ?? {};

    if (!payload.codigo) {
      return res.status(400).json({ message: "El campo 'codigo' es obligatorio." });
    }

    const existe = await Riesgo.findOne({ where: { codigo: payload.codigo } });
    if (existe) {
      return res.status(409).json({ message: "Ya existe un riesgo con ese código." });
    }

    const riesgo = await Riesgo.create(payload);
    return res.status(201).json(riesgo);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear el riesgo", error: error.message });
  }
};

/** Listar todos los Riesgos */
export const getRiesgos = async (_req: Request, res: Response) => {
  try {
    const riesgos = await Riesgo.findAll({
      order: [["creadoEn", "DESC"]],
    });
    return res.json(riesgos);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener riesgos", error: error.message });
  }
};

/** Obtener Riesgo por ID */
export const getRiesgoById = async (req: Request, res: Response) => {
  try {
    const riesgo = await Riesgo.findByPk(req.params.id);
    if (!riesgo) return res.status(404).json({ message: "Riesgo no encontrado" });
    return res.json(riesgo);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener el riesgo", error: error.message });
  }
};

/** Actualizar Riesgo por ID */
export const updateRiesgo = async (req: Request, res: Response) => {
  try {
    const riesgo = await Riesgo.findByPk(req.params.id);
    if (!riesgo) return res.status(404).json({ message: "Riesgo no encontrado" });

    const payload = req.body ?? {};
    await riesgo.update(payload);
    return res.json(riesgo);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar el riesgo", error: error.message });
  }
};

/** Eliminar Riesgo por ID */
export const deleteRiesgo = async (req: Request, res: Response) => {
  try {
    const riesgo = await Riesgo.findByPk(req.params.id);
    if (!riesgo) return res.status(404).json({ message: "Riesgo no encontrado" });

    await riesgo.destroy();
    return res.status(204).send();
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el riesgo", error: error.message });
  }
};