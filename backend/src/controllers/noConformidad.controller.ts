import { Request, Response } from "express";
import NoConformidad from "../models/noConformidad.model";

/** Crear No Conformidad */
export const createNoConformidad = async (req: Request, res: Response) => {
  try {
    const { codigo, descripcion, responsableId, estado } = req.body;

    // Validación de campos obligatorios
    if (!codigo || !descripcion) {
      return res.status(400).json({
        message: "Los campos 'codigo' y 'descripcion' son obligatorios.",
      });
    }

    // Verificar si ya existe una no conformidad con el mismo código
    const existe = await NoConformidad.findOne({ where: { codigo } });
    if (existe) {
      return res
        .status(409)
        .json({ message: "Ya existe una no conformidad con ese código." });
    }

    // Crear registro
    const nueva = await NoConformidad.create({
      codigo,
      descripcion,
      responsableId,
      estado,
    });

    return res.status(201).json(nueva);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear la no conformidad",
      error: error.message,
    });
  }
};

/** Listar todas las No Conformidades */
export const getNoConformidades = async (req: Request, res: Response) => {
  try {
    const { estado } = req.query;
    
    const where: any = {};
    if (estado) {
      where.estado = estado;
    }
    
    const lista = await NoConformidad.findAll({
      where,
      order: [["creadoEn", "DESC"]],
      include: [
        { association: "detectadoPorUsuario" },
        { association: "responsable" },
        { association: "area" },
      ],
    });
    return res.json(lista);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener las no conformidades",
      error: error.message,
    });
  }
};

/** Obtener una No Conformidad por ID */
export const getNoConformidadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const nc = await NoConformidad.findByPk(id);

    if (!nc)
      return res.status(404).json({ message: "No conformidad no encontrada." });

    return res.json(nc);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener la no conformidad",
      error: error.message,
    });
  }
};

/** Actualizar una No Conformidad */
export const updateNoConformidad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { descripcion, responsableId, estado } = req.body;

    const nc = await NoConformidad.findByPk(id);
    if (!nc)
      return res.status(404).json({ message: "No conformidad no encontrada." });

    await nc.update({ descripcion, responsableId, estado });
    return res.json(nc);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar la no conformidad",
      error: error.message,
    });
  }
};

/** Eliminar una No Conformidad */
export const deleteNoConformidad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const nc = await NoConformidad.findByPk(id);

    if (!nc)
      return res.status(404).json({ message: "No conformidad no encontrada." });

    await nc.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al eliminar la no conformidad",
      error: error.message,
    });
  }
};
