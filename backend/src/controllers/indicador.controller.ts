import { Request, Response } from "express";
import Indicador from "../models/indicador.model";

/** Crear indicador */
export const createIndicador = async (req: Request, res: Response) => {
  try {
    const { procesoId, descripcion } = req.body;

    const indicador = await Indicador.create({
      procesoId,
      descripcion,
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
export const getIndicadores = async (req: Request, res: Response) => {
  try {
    const { procesoId } = req.query;

    // Build dynamic where clause based on query parameters
    // Note: Indicador model only has: procesoId, descripcion
    const whereClause: any = {};
    if (procesoId) {
      whereClause.procesoId = procesoId;
    }

    const indicadores = await Indicador.findAll({
      where: whereClause,
      order: [["creadoEn", "DESC"]],
    });
    return res.json(indicadores);
  } catch (error: any) {
    console.error("Error en getIndicadores:", error);
    console.error("Stack trace:", error.stack);
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
    const { id } = req.params;
    const { procesoId, descripcion } = req.body;

    const indicador = await Indicador.findByPk(id);
    if (!indicador) {
      return res.status(404).json({ message: "Indicador no encontrado" });
    }

    await indicador.update({
      procesoId,
      descripcion,
    });

    return res.json(indicador);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el indicador",
      error: error.message,
    });
  }
};
