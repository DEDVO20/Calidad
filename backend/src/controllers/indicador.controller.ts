import { Request, Response } from "express";
import Indicador from "../models/indicador.model";

/** Crear indicador */
export const createIndicador = async (req: Request, res: Response) => {
  try {
    const {
      procesoId,
      codigo,
      nombre,
      descripcion,
      tipo,
      formula,
      unidadMedida,
      meta,
      frecuenciaMedicion,
      responsableId,
      estado,
    } = req.body;

    if (!codigo || !nombre) {
      return res.status(400).json({
        message: "Los campos 'codigo' y 'nombre' son obligatorios.",
      });
    }

    // Verificar si ya existe un indicador con el mismo código
    const existe = await Indicador.findOne({ where: { codigo } });
    if (existe) {
      return res.status(409).json({
        message: "Ya existe un indicador con ese código.",
      });
    }

    const indicador = await Indicador.create({
      procesoId,
      codigo,
      nombre,
      descripcion,
      tipo,
      formula,
      unidadMedida,
      meta,
      frecuenciaMedicion,
      responsableId,
      estado,
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
    const { procesoId, tipo, estado } = req.query;

    // Build dynamic where clause based on query parameters
    const whereClause: any = {};
    if (procesoId) {
      whereClause.procesoId = procesoId;
    }
    if (tipo) {
      whereClause.tipo = tipo;
    }
    if (estado) {
      whereClause.estado = estado;
    }

    const indicadores = await Indicador.findAll({
      where: whereClause,
      order: [["creadoEn", "DESC"]],
      include: [
        { association: "proceso" },
        { association: "responsable" },
      ],
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
    const {
      procesoId,
      codigo,
      nombre,
      descripcion,
      tipo,
      formula,
      unidadMedida,
      meta,
      frecuenciaMedicion,
      responsableId,
      estado,
    } = req.body;

    const indicador = await Indicador.findByPk(id);
    if (!indicador) {
      return res.status(404).json({ message: "Indicador no encontrado" });
    }

    // Verificar si se intenta cambiar el código y ya existe otro con ese código
    if (codigo && codigo !== indicador.codigo) {
      const existe = await Indicador.findOne({ where: { codigo } });
      if (existe) {
        return res.status(409).json({
          message: "Ya existe un indicador con ese código.",
        });
      }
    }

    await indicador.update({
      procesoId,
      codigo,
      nombre,
      descripcion,
      tipo,
      formula,
      unidadMedida,
      meta,
      frecuenciaMedicion,
      responsableId,
      estado,
      actualizadoEn: new Date(),
    });

    return res.json(indicador);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el indicador",
      error: error.message,
    });
  }
};
