import { Request, Response } from "express";
import InstanciaProceso from "../models/instanciaProceso.model";

/** Crear instancia de proceso */
export const createInstanciaProceso = async (req: Request, res: Response) => {
  try {
    const {
      procesoId,
      iniciadoPor,
      estado,
      iniciadoEn,
      completadoEn,
      etapaActualId,
      datos,
      bloqueado,
      razonBloqueo,
    } = req.body;

    if (!procesoId || !estado || !iniciadoEn || !etapaActualId) {
      return res.status(400).json({
        message:
          "Los campos 'procesoId', 'estado', 'iniciadoEn' y 'etapaActualId' son obligatorios.",
      });
    }

    const instanciaProceso = await InstanciaProceso.create({
      procesoId,
      iniciadoPor,
      estado,
      iniciadoEn,
      completadoEn,
      etapaActualId,
      datos,
      bloqueado,
      razonBloqueo,
      creadoEn: new Date(),
    });

    return res.status(201).json(instanciaProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear la instancia de proceso",
      error: error.message,
    });
  }
};

/** Listar todas las instancias de proceso */
export const getInstanciasProceso = async (_req: Request, res: Response) => {
  try {
    const instanciasProceso = await InstanciaProceso.findAll({
      order: [["iniciadoEn", "DESC"]],
    });
    return res.json(instanciasProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener instancias de proceso",
      error: error.message,
    });
  }
};

/** Obtener instancia de proceso por ID */
export const getInstanciaProcesoById = async (req: Request, res: Response) => {
  try {
    const instanciaProceso = await InstanciaProceso.findByPk(req.params.id);
    if (!instanciaProceso) {
      return res.status(404).json({
        message: "Instancia de proceso no encontrada",
      });
    }
    return res.json(instanciaProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener la instancia de proceso",
      error: error.message,
    });
  }
};

/** Actualizar instancia de proceso por ID */
export const updateInstanciaProceso = async (req: Request, res: Response) => {
  try {
    const {
      procesoId,
      iniciadoPor,
      estado,
      iniciadoEn,
      completadoEn,
      etapaActualId,
      datos,
      bloqueado,
      razonBloqueo,
    } = req.body;

    const instanciaProceso = await InstanciaProceso.findByPk(req.params.id);
    if (!instanciaProceso) {
      return res.status(404).json({
        message: "Instancia de proceso no encontrada",
      });
    }

    await instanciaProceso.update({
      procesoId,
      iniciadoPor,
      estado,
      iniciadoEn,
      completadoEn,
      etapaActualId,
      datos,
      bloqueado,
      razonBloqueo,
      actualizadoEn: new Date(),
    });

    return res.json(instanciaProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar la instancia de proceso",
      error: error.message,
    });
  }
};
