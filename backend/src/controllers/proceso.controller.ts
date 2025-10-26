import { Request, Response } from "express";
import Proceso from "../models/proceso.model";

/** Crear proceso */
export const createProceso = async (req: Request, res: Response) => {
  try {
    const {
      codigo,
      nombre,
      areaId,
      objetivo,
      alcance,
      etapaPhva,
      restringido,
      creadoPor,
      tipoProceso,
      responsableId,
      estado,
      version,
      fechaAprobacion,
      proximaRevision,
    } = req.body;

    if (!codigo || !nombre) {
      return res.status(400).json({
        message: "Los campos 'codigo' y 'nombre' son obligatorios.",
      });
    }

    const codigoExiste = await Proceso.findOne({ where: { codigo } });
    if (codigoExiste) {
      return res.status(409).json({
        message: "Ya existe un proceso con ese código.",
      });
    }

    const proceso = await Proceso.create({
      codigo,
      nombre,
      areaId,
      objetivo,
      alcance,
      etapaPhva,
      restringido: restringido !== undefined ? restringido : false,
      creadoPor,
      tipoProceso,
      responsableId,
      estado: estado || "activo",
      version,
      fechaAprobacion,
      proximaRevision,
    });

    return res.status(201).json(proceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear el proceso",
      error: error.message,
    });
  }
};

/** Listar todos los procesos */
export const getProcesos = async (_req: Request, res: Response) => {
  try {
    const procesos = await Proceso.findAll({
      order: [["creadoEn", "DESC"]],
    });
    return res.json(procesos);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener procesos",
      error: error.message,
    });
  }
};

/** Obtener proceso por ID */
export const getProcesoById = async (req: Request, res: Response) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id);
    if (!proceso) {
      return res.status(404).json({
        message: "Proceso no encontrado",
      });
    }
    return res.json(proceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener el proceso",
      error: error.message,
    });
  }
};

/** Actualizar proceso por ID */
export const updateProceso = async (req: Request, res: Response) => {
  try {
    const {
      codigo,
      nombre,
      areaId,
      objetivo,
      alcance,
      etapaPhva,
      restringido,
      creadoPor,
      tipoProceso,
      responsableId,
      estado,
      version,
      fechaAprobacion,
      proximaRevision,
    } = req.body;

    const proceso = await Proceso.findByPk(req.params.id);
    if (!proceso) {
      return res.status(404).json({
        message: "Proceso no encontrado",
      });
    }

    if (codigo && codigo !== proceso.codigo) {
      const codigoExiste = await Proceso.findOne({ where: { codigo } });
      if (codigoExiste) {
        return res.status(409).json({
          message: "Ya existe un proceso con ese código.",
        });
      }
    }

    await proceso.update({
      codigo,
      nombre,
      areaId,
      objetivo,
      alcance,
      etapaPhva,
      restringido,
      creadoPor,
      tipoProceso,
      responsableId,
      estado,
      version,
      fechaAprobacion,
      proximaRevision,
      actualizadoEn: new Date(),
    });

    return res.json(proceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el proceso",
      error: error.message,
    });
  }
};
