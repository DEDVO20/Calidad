import { Request, Response } from "express";
import Area from "../models/area.model";

/** Crear Área */
export const createArea = async (req: Request, res: Response) => {
  try {
    const { codigo, nombre, descripcion } = req.body;

    if (!codigo || !nombre) {
      return res
        .status(400)
        .json({ message: "Los campos 'codigo' y 'nombre' son obligatorios." });
    }

    const existe = await Area.findOne({ where: { codigo } });
    if (existe)
      return res
        .status(409)
        .json({ message: "Ya existe un área con ese código." });

    const area = await Area.create({ codigo, nombre, descripcion });
    return res.status(201).json(area);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al crear el área", error: error.message });
  }
};

/** Listar todas las Áreas */
export const getAreas = async (_req: Request, res: Response) => {
  try {
    const areas = await Area.findAll({ order: [["creadoEn", "DESC"]] });
    return res.json(areas);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener áreas", error: error.message });
  }
};

/** Obtener Área por ID */
export const getAreaById = async (req: Request, res: Response) => {
  try {
    const area = await Area.findByPk(req.params.id);
    if (!area) return res.status(404).json({ message: "Área no encontrada" });
    return res.json(area);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener el área", error: error.message });
  }
};

/** Actualizar Área por ID */
export const updateArea = async (req: Request, res: Response) => {
  try {
    const { codigo, nombre, descripcion } = req.body;
    const area = await Area.findByPk(req.params.id);
    if (!area) return res.status(404).json({ message: "Área no encontrada" });

    await area.update({ codigo, nombre, descripcion });
    return res.json(area);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al actualizar el área", error: error.message });
  }
};
