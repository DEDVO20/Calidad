import { Request, Response } from "express";
import DocumentoProceso from "../models/documentoProceso.model";

/** Crear documento de proceso */
export const createDocumentoProceso = async (req: Request, res: Response) => {
  try {
    const { instanciaId, documentoId, nota } = req.body;

    if (!instanciaId || !documentoId) {
      return res.status(400).json({
        message: "Los campos 'instanciaId' y 'documentoId' son obligatorios.",
      });
    }

    const documentoProceso = await DocumentoProceso.create({
      instanciaId,
      documentoId,
      nota,
      adjuntadoEn: new Date(),
    });

    return res.status(201).json(documentoProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear el documento de proceso",
      error: error.message,
    });
  }
};

/** Listar todos los documentos de proceso */
export const getDocumentosProceso = async (_req: Request, res: Response) => {
  try {
    const documentosProceso = await DocumentoProceso.findAll({
      order: [["adjuntadoEn", "DESC"]],
    });
    return res.json(documentosProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener documentos de proceso",
      error: error.message,
    });
  }
};

/** Obtener documento de proceso por ID */
export const getDocumentoProcesoById = async (req: Request, res: Response) => {
  try {
    const documentoProceso = await DocumentoProceso.findByPk(req.params.id);
    if (!documentoProceso) {
      return res.status(404).json({
        message: "Documento de proceso no encontrado",
      });
    }
    return res.json(documentoProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener el documento de proceso",
      error: error.message,
    });
  }
};

/** Actualizar documento de proceso por ID */
export const updateDocumentoProceso = async (req: Request, res: Response) => {
  try {
    const { instanciaId, documentoId, nota } = req.body;

    const documentoProceso = await DocumentoProceso.findByPk(req.params.id);
    if (!documentoProceso) {
      return res.status(404).json({
        message: "Documento de proceso no encontrado",
      });
    }

    await documentoProceso.update({
      instanciaId,
      documentoId,
      nota,
    });

    return res.json(documentoProceso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el documento de proceso",
      error: error.message,
    });
  }
};
