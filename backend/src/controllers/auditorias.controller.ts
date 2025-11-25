import { Request, Response } from "express";
import Auditorias from "../models/auditorias.model";

/** Crear Auditoría */
export const createAuditoria = async (req: Request, res: Response) => {
  try {
    const {
      codigo,
      tipo,
      objetivo,
      alcance,
      normaReferencia,
      auditorLiderId,
      fechaPlanificada,
      fechaInicio,
      fechaFin,
      estado,
      creadoPor,
    } = req.body;

    // Validaciones básicas
    if (!codigo) {
      return res
        .status(400)
        .json({ message: "El código de la auditoría es obligatorio" });
    }

    // Verificar si ya existe una auditoría con ese código
    const existente = await Auditorias.findOne({ where: { codigo } });
    if (existente) {
      return res
        .status(400)
        .json({ message: "Ya existe una auditoría con ese código" });
    }

    const auditoria = await Auditorias.create({
      codigo,
      tipo,
      objetivo,
      alcance,
      normaReferencia,
      auditorLiderId,
      fechaPlanificada,
      fechaInicio,
      fechaFin,
      estado: estado || "planificada",
      creadoPor,
    });

    return res.status(201).json({
      message: "Auditoría creada exitosamente",
      auditoria,
    });
  } catch (error: any) {
    console.error("Error al crear auditoría:", error);
    return res.status(500).json({
      message: "Error al crear la auditoría",
      error: error.message,
    });
  }
};

/** Listar todas las Auditorías */
export const getAuditorias = async (req: Request, res: Response) => {
  try {
    const { tipo, estado } = req.query;

    // Construir filtros opcionales
    const whereClause: Record<string, any> = {};
    if (tipo && typeof tipo === 'string') {
      whereClause.tipo = tipo;
    }
    if (estado && typeof estado === 'string') {
      whereClause.estado = estado;
    }

    const options: any = {
      order: [["creadoEn", "DESC"]],
    };

    // Solo agregar where si hay filtros
    if (Object.keys(whereClause).length > 0) {
      options.where = whereClause;
    }

    const auditorias = await Auditorias.findAll(options);

    return res.json(auditorias);
  } catch (error: any) {
    console.error("Error en getAuditorias:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener auditorías", error: error.message });
  }
};

/** Obtener Auditoría por ID */
export const getAuditoriaById = async (req: Request, res: Response) => {
  try {
    const auditoria = await Auditorias.findByPk(req.params.id);
    if (!auditoria)
      return res.status(404).json({ message: "Auditoría no encontrada" });
    return res.json(auditoria);
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener la auditoría", error: error.message });
  }
};

/** Actualizar Auditoría por ID */
export const updateAuditoria = async (req: Request, res: Response) => {
  try {
    const auditoria = await Auditorias.findByPk(req.params.id);
    if (!auditoria)
      return res.status(404).json({ message: "Auditoría no encontrada" });

    const payload = req.body ?? {};
    if (Object.keys(payload).length === 0) {
      return res
        .status(400)
        .json({ message: "El cuerpo de la solicitud está vacío" });
    }

    await auditoria.update(payload);
    return res.json(auditoria);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Error al actualizar la auditoría",
      error: error.message,
    });
  }
};

/** Eliminar Auditoría por ID */
export const deleteAuditoria = async (req: Request, res: Response) => {
  try {
    const auditoria = await Auditorias.findByPk(req.params.id);
    if (!auditoria)
      return res.status(404).json({ message: "Auditoría no encontrada" });

    await auditoria.destroy();
    return res.status(204).send();
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Error al eliminar la auditoría",
      error: error.message,
    });
  }
};
