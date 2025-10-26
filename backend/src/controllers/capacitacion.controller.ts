import { Request, Response } from "express";
import Capacitacion from "../models/capacitacion.model";

/** Crear una nueva Capacitación */
export const createCapacitacion = async (req: Request, res: Response) => {
  try {
    const {
      titulo,
      descripcion,
      tipo,
      instructor,
      duracionHoras,
      fechaProgramada,
      fechaRealizacion,
      lugar,
      responsableId,
      estado,
    } = req.body;

    // Validación mínima
    if (!titulo || !tipo) {
      return res.status(400).json({
        message: "Los campos 'titulo' y 'tipo' son obligatorios.",
      });
    }

    const nueva = await Capacitacion.create({
      titulo,
      descripcion,
      tipo,
      instructor,
      duracionHoras,
      fechaProgramada,
      fechaRealizacion,
      lugar,
      responsableId,
      estado,
    });

    return res.status(201).json(nueva);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear la capacitación.",
      error: error.message,
    });
  }
};

/** Listar todas las Capacitaciones */
export const getCapacitaciones = async (req: Request, res: Response) => {
  try {
    const lista = await Capacitacion.findAll({
      order: [["creadoEn", "DESC"]],
    });
    return res.json(lista);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener las capacitaciones.",
      error: error.message,
    });
  }
};

/** Obtener una Capacitación por ID */
export const getCapacitacionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cap = await Capacitacion.findByPk(id);

    if (!cap) {
      return res.status(404).json({
        message: "Capacitación no encontrada.",
      });
    }

    return res.json(cap);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener la capacitación.",
      error: error.message,
    });
  }
};

/** Actualizar una Capacitación */
export const updateCapacitacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      tipo,
      instructor,
      duracionHoras,
      fechaProgramada,
      fechaRealizacion,
      lugar,
      responsableId,
      estado,
    } = req.body;

    const cap = await Capacitacion.findByPk(id);
    if (!cap) {
      return res.status(404).json({
        message: "Capacitación no encontrada.",
      });
    }

    await cap.update({
      titulo,
      descripcion,
      tipo,
      instructor,
      duracionHoras,
      fechaProgramada,
      fechaRealizacion,
      lugar,
      responsableId,
      estado,
    });

    return res.json(cap);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar la capacitación.",
      error: error.message,
    });
  }
};

/** Eliminar una Capacitación */
export const deleteCapacitacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cap = await Capacitacion.findByPk(id);

    if (!cap) {
      return res.status(404).json({
        message: "Capacitación no encontrada.",
      });
    }

    await cap.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al eliminar la capacitación.",
      error: error.message,
    });
  }
};
