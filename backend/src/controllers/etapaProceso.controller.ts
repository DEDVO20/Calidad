import { Request, Response } from "express";
import EtapaProceso from "../models/etapaProceso.model";

/** Crear etapa de proceso */
export const createEtapaProceso = async (req: Request, res: Response) => {
  try {
    const {
      procesoId,
      orden,
      nombre,
      rolId,
      horasMaximas,
      permiteReapertura,
    } = req.body;

    if (!procesoId || !orden || !nombre) {
      return res.status(400).json({
        message: "Los campos 'procesoId', 'orden' y 'nombre' son obligatorios.",
      });
    }

    const etapaProceso = await EtapaProceso.create({
      procesoId,
      orden,
      nombre,
      rolId,
      horasMaximas,
      permiteReapertura,
    });

    return res.status(201).json(etapaProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear la etapa de proceso",
      error: error.message,
    });
  }
};

/** Listar todas las etapas de proceso */
export const getEtapasProceso = async (_req: Request, res: Response) => {
  try {
    const etapasProceso = await EtapaProceso.findAll({
      order: [["orden", "ASC"]],
    });
    return res.json(etapasProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener etapas de proceso",
      error: error.message,
    });
  }
};

/** Obtener etapa de proceso por ID */
export const getEtapaProcesoById = async (req: Request, res: Response) => {
  try {
    const etapaProceso = await EtapaProceso.findByPk(req.params.id);
    if (!etapaProceso) {
      return res.status(404).json({
        message: "Etapa de proceso no encontrada",
      });
    }
    return res.json(etapaProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener la etapa de proceso",
      error: error.message,
    });
  }
};

/** Actualizar etapa de proceso por ID */
export const updateEtapaProceso = async (req: Request, res: Response) => {
  try {
    const {
      procesoId,
      orden,
      nombre,
      rolId,
      horasMaximas,
      permiteReapertura,
    } = req.body;

    const etapaProceso = await EtapaProceso.findByPk(req.params.id);
    if (!etapaProceso) {
      return res.status(404).json({
        message: "Etapa de proceso no encontrada",
      });
    }

    await etapaProceso.update({
      procesoId,
      orden,
      nombre,
      rolId,
      horasMaximas,
      permiteReapertura,
    });

    return res.json(etapaProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar la etapa de proceso",
      error: error.message,
    });
  }
};