import { Request, Response } from "express";
import { Op } from "sequelize";
import Documento from "../models/documento.model";

/** Crear documento */
export const createDocumento = async (req: Request, res: Response) => {
  try {
    const {
      nombreArchivo,
      rutaAlmacenamiento,
      tipoMime,
      tamañoBytes,
      subidoPor,
      visibilidad,
      tipoDocumento,
      codigoDocumento,
      version,
      estado,
      aprobadoPor,
      fechaAprobacion,
      proximaRevision,
    } = req.body;

    if (!nombreArchivo) {
      return res
        .status(400)
        .json({ message: "El campo 'nombreArchivo' es obligatorio." });
    }

    const doc = await Documento.create({
      nombreArchivo,
      rutaAlmacenamiento,
      tipoMime,
      tamañoBytes,
      subidoPor,
      visibilidad,
      tipoDocumento,
      codigoDocumento,
      version,
      estado,
      aprobadoPor,
      fechaAprobacion,
      proximaRevision,
      // creadoEn lo maneja el modelo si corresponde
    });

    return res.status(201).json(doc);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al crear documento", error: error.message });
  }
};

/** Listar documentos con filtros y paginación */
export const getDocumentos = async (req: Request, res: Response) => {
  try {
    const {
      q,                 // búsqueda por nombre/código (texto)
      estado,
      tipoDocumento,
      visibilidad,
      page = "1",
      limit = "20",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit as string, 10) || 20, 1);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};

    if (estado) where.estado = estado;
    if (tipoDocumento) where.tipoDocumento = tipoDocumento;
    if (visibilidad) where.visibilidad = visibilidad;

    if (q && q.trim()) {
      where[Op.or] = [
        { nombreArchivo: { [Op.iLike]: `%${q}%` } },
        { codigoDocumento: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const { rows, count } = await Documento.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [["creadoEn", "DESC"]],
      include: [
        // usa los alias definidos en el modelo
        { association: "autor" },
        { association: "aprobador" },
        { association: "versiones" },
        { association: "procesosRelacionados" },
      ],
    });

    return res.json({
      items: rows,
      total: count,
      page: pageNum,
      pages: Math.ceil(count / limitNum),
      limit: limitNum,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener documentos", error: error.message });
  }
};

/** Obtener documento por ID */
export const getDocumentoById = async (req: Request, res: Response) => {
  try {
    const doc = await Documento.findByPk(req.params.id, {
      include: [
        { association: "autor" },
        { association: "aprobador" },
        { association: "versiones" },
        { association: "procesosRelacionados" },
      ],
    });

    if (!doc) return res.status(404).json({ message: "Documento no encontrado" });
    return res.json(doc);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener documento", error: error.message });
  }
};

/** Actualizar documento por ID */
export const updateDocumento = async (req: Request, res: Response) => {
  try {
    const doc = await Documento.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: "Documento no encontrado" });

    const {
      nombreArchivo,
      rutaAlmacenamiento,
      tipoMime,
      tamañoBytes,
      subidoPor,
      visibilidad,
      tipoDocumento,
      codigoDocumento,
      version,
      estado,
      aprobadoPor,
      fechaAprobacion,
      proximaRevision,
    } = req.body;

    await doc.update({
      nombreArchivo,
      rutaAlmacenamiento,
      tipoMime,
      tamañoBytes,
      subidoPor,
      visibilidad,
      tipoDocumento,
      codigoDocumento,
      version,
      estado,
      aprobadoPor,
      fechaAprobacion,
      proximaRevision,
    });

    return res.json(doc);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al actualizar documento", error: error.message });
  }
};

/** Eliminar documento por ID */
export const deleteDocumento = async (req: Request, res: Response) => {
  try {
    const rows = await Documento.destroy({ where: { id: req.params.id } });
    if (rows === 0) return res.status(404).json({ message: "Documento no encontrado" });
    return res.status(204).send();
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al eliminar documento", error: error.message });
  }
};
