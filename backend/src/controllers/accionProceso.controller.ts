import { Request, Response } from "express";
import AccionProceso from "../models/AccionProceso.model";

/** Crear acción de proceso */
export const createAccionProceso = async (req: Request, res: Response) => {
  try {
    const {
      instanciaId,
      etapaId,
      ejecutadoPor,
      tipoAccion,
      comentario,
      ejecutadoEn,
      tiempoRespuestaSegundos,
    } = req.body;

    if (!instanciaId || !etapaId || !tipoAccion || !ejecutadoEn) {
      return res.status(400).json({
        message: "Los campos 'instanciaId', 'etapaId', 'tipoAccion' y 'ejecutadoEn' son obligatorios.",
      });
    }

    const accionProceso = await AccionProceso.create({
      instanciaId,
      etapaId,
      ejecutadoPor,
      tipoAccion,
      comentario,
      ejecutadoEn,
      tiempoRespuestaSegundos: tiempoRespuestaSegundos || 0,
    });

    return res.status(201).json(accionProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear la acción de proceso",
      error: error.message,
    });
  }
};

/** Listar todas las acciones de proceso */
export const getAccionesProceso = async (_req: Request, res: Response) => {
  try {
    const accionesProceso = await AccionProceso.findAll({
      order: [["ejecutadoEn", "DESC"]],
    });
    return res.json(accionesProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener acciones de proceso",
      error: error.message,
    });
  }
};

/** Obtener acción de proceso por ID */
export const getAccionProcesoById = async (req: Request, res: Response) => {
  try {
    const accionProceso = await AccionProceso.findByPk(req.params.id);
    if (!accionProceso) {
      return res.status(404).json({
        message: "Acción de proceso no encontrada",
      });
    }
    return res.json(accionProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener la acción de proceso",
      error: error.message,
    });
  }
};

/** Actualizar acción de proceso por ID */
export const updateAccionProceso = async (req: Request, res: Response) => {
  try {
    const {
      instanciaId,
      etapaId,
      ejecutadoPor,
      tipoAccion,
      comentario,
      ejecutadoEn,
      tiempoRespuestaSegundos,
    } = req.body;

    const accionProceso = await AccionProceso.findByPk(req.params.id);
    if (!accionProceso) {
      return res.status(404).json({
        message: "Acción de proceso no encontrada",
      });
    }

    await accionProceso.update({
      instanciaId,
      etapaId,
      ejecutadoPor,
      tipoAccion,
      comentario,
      ejecutadoEn,
      tiempoRespuestaSegundos,
    });

    return res.json(accionProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar la acción de proceso",
      error: error.message,
    });
  }
};