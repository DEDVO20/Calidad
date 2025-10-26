import { Request, Response } from "express";
import AsistenciaCapacitacion from "../models/AsistenciaCapacitacion.model";

/** Crear una asistencia */
export const createAsistencia = async (req: Request, res: Response) => {
  try {
    const { capacitacionId, usuarioId, asistio } = req.body;

    if (!capacitacionId || !usuarioId) {
      return res.status(400).json({
        message: "Los campos 'capacitacionId' y 'usuarioId' son obligatorios.",
      });
    }

    const existe = await AsistenciaCapacitacion.findOne({
      where: { capacitacionId, usuarioId },
    });

    if (existe) {
      return res.status(409).json({
        message: "El usuario ya tiene una asistencia registrada en esta capacitación.",
      });
    }

    const nueva = await AsistenciaCapacitacion.create({
      capacitacionId,
      usuarioId,
      asistio: asistio ?? false,
    });

    return res.status(201).json(nueva);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear la asistencia",
      error: error.message,
    });
  }
};

/** Listar todas las asistencias */
export const getAsistencias = async (req: Request, res: Response) => {
  try {
    const lista = await AsistenciaCapacitacion.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.json(lista);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener las asistencias",
      error: error.message,
    });
  }
};

/** Obtener una asistencia por ID */
export const getAsistenciaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asistencia = await AsistenciaCapacitacion.findByPk(id);

    if (!asistencia) {
      return res.status(404).json({ message: "Asistencia no encontrada." });
    }

    return res.json(asistencia);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener la asistencia",
      error: error.message,
    });
  }
};

/** Actualizar una asistencia */
export const updateAsistencia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { asistio } = req.body;

    const asistencia = await AsistenciaCapacitacion.findByPk(id);
    if (!asistencia) {
      return res.status(404).json({ message: "Asistencia no encontrada." });
    }

    await asistencia.update({ asistio });
    return res.json(asistencia);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar la asistencia",
      error: error.message,
    });
  }
};

/** Eliminar una asistencia */
export const deleteAsistencia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asistencia = await AsistenciaCapacitacion.findByPk(id);

    if (!asistencia) {
      return res.status(404).json({ message: "Asistencia no encontrada." });
    }

    await asistencia.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al eliminar la asistencia",
      error: error.message,
    });
  }
};
