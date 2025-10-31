import { Request, Response } from "express";
import SeguimientoObjetivo from "../models/seguimientoObjetivo.model";

/** Crear seguimiento de objetivo */
export const createSeguimientoObjetivo = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      objetivoId,
      periodo,
      valorAlcanzado,
      porcentajeCumplimiento,
      observaciones,
      registradoPor,
    } = req.body;

    if (!objetivoId) {
      return res.status(400).json({
        message: "El campo 'objetivoId' es obligatorio.",
      });
    }

    const seguimientoObjetivo = await SeguimientoObjetivo.create({
      objetivoId,
      periodo,
      valorAlcanzado,
      porcentajeCumplimiento,
      observaciones,
      registradoPor,
    });

    return res.status(201).json(seguimientoObjetivo);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear el seguimiento de objetivo",
      error: error.message,
    });
  }
};

/** Listar todos los seguimientos de objetivo */
export const getSeguimientosObjetivo = async (_req: Request, res: Response) => {
  try {
    const seguimientosObjetivo = await SeguimientoObjetivo.findAll({
      order: [["creadoEn", "DESC"]],
    });
    return res.json(seguimientosObjetivo);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener seguimientos de objetivo",
      error: error.message,
    });
  }
};

/** Obtener seguimiento de objetivo por ID */
export const getSeguimientoObjetivoById = async (
  req: Request,
  res: Response,
) => {
  try {
    const seguimientoObjetivo = await SeguimientoObjetivo.findByPk(
      req.params.id,
    );
    if (!seguimientoObjetivo) {
      return res.status(404).json({
        message: "Seguimiento de objetivo no encontrado",
      });
    }
    return res.json(seguimientoObjetivo);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener el seguimiento de objetivo",
      error: error.message,
    });
  }
};

/** Actualizar seguimiento de objetivo por ID */
export const updateSeguimientoObjetivo = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      objetivoId,
      periodo,
      valorAlcanzado,
      porcentajeCumplimiento,
      observaciones,
      registradoPor,
    } = req.body;

    const seguimientoObjetivo = await SeguimientoObjetivo.findByPk(
      req.params.id,
    );
    if (!seguimientoObjetivo) {
      return res.status(404).json({
        message: "Seguimiento de objetivo no encontrado",
      });
    }

    await seguimientoObjetivo.update({
      objetivoId,
      periodo,
      valorAlcanzado,
      porcentajeCumplimiento,
      observaciones,
      registradoPor,
    });

    return res.json(seguimientoObjetivo);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el seguimiento de objetivo",
      error: error.message,
    });
  }
};
