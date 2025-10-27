import { Request, Response } from "express";
import VersionDocumento from "../models/versionDocumento.model";

export const createVersionDocumento = async (req: Request, res: Response) => {
  try {
    const { documentoId, numeroVersion, subidoPor, cambios, rutaArchivo } =
      req.body;

    const versionDocumento = await VersionDocumento.create({
      documentoId,
      numeroVersion,
      subidoPor,
      cambios,
      rutaArchivo,
    });

    res.status(201).json(versionDocumento);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la versión del documento", error });
  }
};

export const getAllVersionesDocumento = async (req: Request, res: Response) => {
  try {
    const versiones = await VersionDocumento.findAll();
    res.status(200).json(versiones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las versiones de documentos", error });
  }
};

export const getVersionDocumentoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const versionDocumento = await VersionDocumento.findByPk(id);

    if (!versionDocumento) {
      return res
        .status(404)
        .json({ message: "Versión del documento no encontrada" });
    }

    res.status(200).json(versionDocumento);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la versión del documento", error });
  }
};

export const getVersionesByDocumento = async (req: Request, res: Response) => {
  try {
    const { documentoId } = req.params;
    const versiones = await VersionDocumento.findAll({
      where: { documentoId },
      order: [["numeroVersion", "DESC"]],
    });
    res.status(200).json(versiones);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener las versiones del documento",
        error,
      });
  }
};

export const getUltimaVersionByDocumento = async (
  req: Request,
  res: Response,
) => {
  try {
    const { documentoId } = req.params;
    const ultimaVersion = await VersionDocumento.findOne({
      where: { documentoId },
      order: [["numeroVersion", "DESC"]],
    });

    if (!ultimaVersion) {
      return res
        .status(404)
        .json({ message: "No se encontraron versiones para este documento" });
    }

    res.status(200).json(ultimaVersion);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener la última versión del documento",
        error,
      });
  }
};

export const getVersionesByUsuario = async (req: Request, res: Response) => {
  try {
    const { usuarioId } = req.params;
    const versiones = await VersionDocumento.findAll({
      where: { subidoPor: usuarioId },
      order: [["subidoEn", "DESC"]],
    });
    res.status(200).json(versiones);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener las versiones subidas por el usuario",
        error,
      });
  }
};

export const updateVersionDocumento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { documentoId, numeroVersion, subidoPor, cambios, rutaArchivo } =
      req.body;

    const versionDocumento = await VersionDocumento.findByPk(id);

    if (!versionDocumento) {
      return res
        .status(404)
        .json({ message: "Versión del documento no encontrada" });
    }

    await versionDocumento.update({
      documentoId,
      numeroVersion,
      subidoPor,
      cambios,
      rutaArchivo,
    });

    res.status(200).json(versionDocumento);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar la versión del documento",
        error,
      });
  }
};

export const deleteVersionDocumento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const versionDocumento = await VersionDocumento.findByPk(id);

    if (!versionDocumento) {
      return res
        .status(404)
        .json({ message: "Versión del documento no encontrada" });
    }

    await versionDocumento.destroy();
    res
      .status(200)
      .json({ message: "Versión del documento eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la versión del documento", error });
  }
};
