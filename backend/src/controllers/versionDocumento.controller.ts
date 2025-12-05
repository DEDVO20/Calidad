import { Request, Response } from "express";
import VersionDocumento from "../models/versionDocumento.model";

export const createVersionDocumento = async (req: Request, res: Response) => {
  try {
    const { documentoId, numeroVersion, versionString, subidoPor, cambios, rutaArchivo } =
      req.body;

    const versionDocumento = await VersionDocumento.create({
      documentoId,
      numeroVersion,
      versionString: versionString || "1.0",
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

/** Restaurar una versión como la versión actual del documento */
export const restoreVersion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const versionDocumento = await VersionDocumento.findByPk(id);

    if (!versionDocumento) {
      return res
        .status(404)
        .json({ message: "Versión del documento no encontrada" });
    }

    // Importar Documento model
    const Documento = require("../models/documento.model").default;
    const doc = await Documento.findByPk(versionDocumento.documentoId);

    if (!doc) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    // Guardar la versión actual antes de restaurar
    const versionActualAnterior = doc.versionActual;
    const ultimaVersion = await VersionDocumento.findOne({
      where: { documentoId: doc.id },
      order: [["numeroVersion", "DESC"]],
    });

    const nuevoNumeroVersion = ultimaVersion
      ? ultimaVersion.numeroVersion + 1
      : 1;

    // Crear versión del estado actual
    await VersionDocumento.create({
      documentoId: doc.id,
      numeroVersion: nuevoNumeroVersion,
      versionString: doc.versionActual,
      subidoPor: doc.subidoPor,
      cambios: `Backup antes de restaurar versión ${versionDocumento.versionString}`,
      rutaArchivo: doc.rutaArchivo,
      archivoUrl: doc.rutaAlmacenamiento,
      estado: "historica",
      nombreArchivo: doc.nombreArchivo,
      tamañoBytes: doc.tamañoBytes,
    });

    // Restaurar la versión seleccionada como actual
    await doc.update({
      rutaAlmacenamiento: versionDocumento.archivoUrl,
      rutaArchivo: versionDocumento.rutaArchivo,
      versionActual: versionDocumento.versionString,
      nombreArchivo: versionDocumento.nombreArchivo,
      tamañoBytes: versionDocumento.tamañoBytes,
      actualizadoEn: new Date(),
    });

    // Marcar la versión restaurada como activa
    await versionDocumento.update({ estado: "activa" });

    res.status(200).json({
      message: `Versión ${versionDocumento.versionString} restaurada correctamente`,
      documento: doc,
      versionAnterior: versionActualAnterior,
    });
  } catch (error) {
    console.error("Error al restaurar versión:", error);
    res.status(500).json({ message: "Error al restaurar la versión", error });
  }
};

/** Comparar dos versiones de un documento */
export const compareVersions = async (req: Request, res: Response) => {
  try {
    const { id1, id2 } = req.params;

    const version1 = await VersionDocumento.findByPk(id1);
    const version2 = await VersionDocumento.findByPk(id2);

    if (!version1 || !version2) {
      return res
        .status(404)
        .json({ message: "Una o ambas versiones no fueron encontradas" });
    }

    if (version1.documentoId !== version2.documentoId) {
      return res
        .status(400)
        .json({
          message: "Las versiones deben pertenecer al mismo documento",
        });
    }

    const comparacion = {
      version1: {
        id: version1.id,
        numeroVersion: version1.numeroVersion,
        versionString: version1.versionString,
        fecha: version1.subidoEn,
        autor: version1.subidoPor,
        cambios: version1.cambios,
        nombreArchivo: version1.nombreArchivo,
        tamañoBytes: version1.tamañoBytes,
        url: version1.archivoUrl,
      },
      version2: {
        id: version2.id,
        numeroVersion: version2.numeroVersion,
        versionString: version2.versionString,
        fecha: version2.subidoEn,
        autor: version2.subidoPor,
        cambios: version2.cambios,
        nombreArchivo: version2.nombreArchivo,
        tamañoBytes: version2.tamañoBytes,
        url: version2.archivoUrl,
      },
      diferencias: {
        cambioTamaño:
          (version2.tamañoBytes || 0) - (version1.tamañoBytes || 0),
        cambioNombre: version1.nombreArchivo !== version2.nombreArchivo,
      },
    };

    res.status(200).json(comparacion);
  } catch (error) {
    console.error("Error al comparar versiones:", error);
    res.status(500).json({ message: "Error al comparar versiones", error });
  }
};

/** Obtener URL de descarga de una versión específica */
export const downloadVersion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const versionDocumento = await VersionDocumento.findByPk(id);

    if (!versionDocumento) {
      return res
        .status(404)
        .json({ message: "Versión del documento no encontrada" });
    }

    if (!versionDocumento.archivoUrl) {
      return res
        .status(404)
        .json({ message: "Esta versión no tiene archivo asociado" });
    }

    res.status(200).json({
      url: versionDocumento.archivoUrl,
      nombreArchivo:
        versionDocumento.nombreArchivo || "documento_version.pdf",
      versionString: versionDocumento.versionString,
    });
  } catch (error) {
    console.error("Error al obtener URL de descarga:", error);
    res
      .status(500)
      .json({ message: "Error al obtener URL de descarga", error });
  }
};
