import { Request, Response } from "express";
import ObjetivoCalidad from "../models/objetivoCalidad.model";

/** Crear objetivo de calidad */
export const createObjetivoCalidad = async (req: Request, res: Response) => {
  try {
    const {
      codigo,
      descripcion,
      procesoId,
      areaId,
      responsableId,
      meta,
      indicadorId,
      valorMeta,
      periodoInicio,
      periodoFin,
      estado,
    } = req.body;

    if (!codigo) {
      return res.status(400).json({
        message: "El campo 'codigo' es obligatorio.",
      });
    }

    const codigoExiste = await ObjetivoCalidad.findOne({ where: { codigo } });
    if (codigoExiste) {
      return res.status(409).json({
        message: "Ya existe un objetivo de calidad con ese código.",
      });
    }

    const objetivoCalidad = await ObjetivoCalidad.create({
      codigo,
      descripcion,
      procesoId,
      areaId,
      responsableId,
      meta,
      indicadorId,
      valorMeta,
      periodoInicio,
      periodoFin,
      estado,
    });

    return res.status(201).json(objetivoCalidad);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear el objetivo de calidad",
      error: error.message,
    });
  }
};

/** Listar todos los objetivos de calidad */
export const getObjetivosCalidad = async (_req: Request, res: Response) => {
  try {
    const objetivosCalidad = await ObjetivoCalidad.findAll({
      order: [["creadoEn", "DESC"]],
    });
    return res.json(objetivosCalidad);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener objetivos de calidad",
      error: error.message,
    });
  }
};

/** Obtener objetivo de calidad por ID */
export const getObjetivoCalidadById = async (req: Request, res: Response) => {
  try {
    const objetivoCalidad = await ObjetivoCalidad.findByPk(req.params.id);
    if (!objetivoCalidad) {
      return res.status(404).json({
        message: "Objetivo de calidad no encontrado",
      });
    }
    return res.json(objetivoCalidad);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener el objetivo de calidad",
      error: error.message,
    });
  }
};

/** Actualizar objetivo de calidad por ID */
export const updateObjetivoCalidad = async (req: Request, res: Response) => {
  try {
    const {
      codigo,
      descripcion,
      procesoId,
      areaId,
      responsableId,
      meta,
      indicadorId,
      valorMeta,
      periodoInicio,
      periodoFin,
      estado,
    } = req.body;

    const objetivoCalidad = await ObjetivoCalidad.findByPk(req.params.id);
    if (!objetivoCalidad) {
      return res.status(404).json({
        message: "Objetivo de calidad no encontrado",
      });
    }

    if (codigo && codigo !== objetivoCalidad.codigo) {
      const codigoExiste = await ObjetivoCalidad.findOne({ where: { codigo } });
      if (codigoExiste) {
        return res.status(409).json({
          message: "Ya existe un objetivo de calidad con ese código.",
        });
      }
    }

    await objetivoCalidad.update({
      codigo,
      descripcion,
      procesoId,
      areaId,
      responsableId,
      meta,
      indicadorId,
      valorMeta,
      periodoInicio,
      periodoFin,
      estado,
    });

    return res.json(objetivoCalidad);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el objetivo de calidad",
      error: error.message,
    });
  }
};
