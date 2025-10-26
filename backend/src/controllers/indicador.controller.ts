import { Request, Response } from "express";
import Indicador from "../models/indicador.model";

/** Crear indicador */
export const createIndicador = async (req: Request, res: Response) => {
  try {
    const { procesoId, clave, descripcion, valor, periodoInicio, periodoFin } =
      req.body;

    if (!clave) {
      return res.status(400).json({
        message: "El campo 'clave' es obligatorio.",
      });
    }

    const indicador = await Indicador.create({
      procesoId,
      clave,
      descripcion,
      valor,
      periodoInicio,
      periodoFin,
    });

    return res.status(201).json(indicador);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear el indicador",
      error: error.message,
    });
  }
};

/** Listar todos los indicadores */
export const getIndicadores = async (_req: Request, res: Response) => {
  try {
    const indicadores = await Indicador.findAll({
      order: [["creadoEn", "DESC"]],
    });
    return res.json(indicadores);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener indicadores",
      error: error.message,
    });
  }
};

/** Obtener indicador por ID */
export const getIndicadorById = async (req: Request, res: Response) => {
  try {
    const indicador = await Indicador.findByPk(req.params.id);
    if (!indicador) {
      return res.status(404).json({
        message: "Indicador no encontrado",
      });
    }
    return res.json(indicador);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener el indicador",
      error: error.message,
    });
  }
};

/** Actualizar indicador por ID */
export const updateIndicador = async (req: Request, res: Response) => {
  try {
    const { procesoId, clave, descripcion, valor, periodoInicio, periodoFin } =
      req.body;

    const indicador = await Indicador.findByPk(req.params.id);
    if (!indicador) {
      return res.status(404).json({
        message: "Indicador no encontrado",
      });
    }

    await indicador.update({
      procesoId,
      clave,
      descripcion,
      valor,
      periodoInicio,
      periodoFin,
    });

    return res.json(indicador);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el indicador",
      error: error.message,
    });
  }
};
