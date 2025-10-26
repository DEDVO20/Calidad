import { Request, Response } from "express";
import Capacitacion from "../models/Capacitacion.model";

/** Crear Capacitación */
export const createCapacitacion = async (req: Request, res: Response) => {
  try {
    const { codigo, tema, responsable, fecha, descripcion } = req.body;

    // Validación básica
    if (!codigo || !tema) {
      return res
        .status(400)
        .json({ message: "Los campos 'codigo' y 'tema' son obligatorios." });
    }

    // Verificar si ya existe una capacitación con el mismo código
    const existe = await Capacitacion.findOne({ where: { codigo } });
    if (existe) {
      return res
        .status(409)
        .json({ message: "Ya existe una capacitación con ese código." });
    }

    const nueva = await Capacitacion.create({
      codigo,
      tema,
      responsable,
      fecha,
      descripcion,
    });

    return res.status(201).json(nueva);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al crear la capacitación", error: error.message });
  }
};

/** Listar todas las Capacitaciones */
export const getCapacitaciones = async (req: Request, res: Response) => {
  try {
    const lista = await Capacitacion.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(lista);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener las capacitaciones", error: error.message });
  }
};

/** Obtener una Capacitación por ID */
export const getCapacitacionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cap = await Capacitacion.findByPk(id);

    if (!cap)
      return res.status(404).json({ message: "Capacitación no encontrada." });

    return res.json(cap);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener la capacitación", error: error.message });
  }
};

/** Actualizar una Capacitación */
export const updateCapacitacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tema, responsable, fecha, descripcion } = req.body;

    const cap = await Capacitacion.findByPk(id);
    if (!cap)
      return res.status(404).json({ message: "Capacitación no encontrada." });

    await cap.update({ tema, responsable, fecha, descripcion });
    return res.json(cap);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al actualizar la capacitación", error: error.message });
  }
};

/** Eliminar una Capacitación */
export const deleteCapacitacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cap = await Capacitacion.findByPk(id);

    if (!cap)
      return res.status(404).json({ message: "Capacitación no encontrada." });

    await cap.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al eliminar la capacitación", error: error.message });
  }
};
