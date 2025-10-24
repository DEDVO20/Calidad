import { Request, Response } from "express";
import RolPermiso from "../models/rolPermiso.model";

/** Crear relación Rol ↔ Permiso */
export const createRolPermiso = async (req: Request, res: Response) => {
  try {
    const { rolId, permisoId } = req.body;

    if (!rolId || !permisoId) {
      return res
        .status(400)
        .json({ message: "Los campos 'rolId' y 'permisoId' son obligatorios." });
    }

    const existente = await RolPermiso.findOne({ where: { rolId, permisoId } });
    if (existente) {
      return res.status(409).json({ message: "La relación ya existe." });
    }

    const relacion = await RolPermiso.create({ rolId, permisoId });
    return res.status(201).json(relacion);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear la relación Rol-Permiso",
      error: error.message,
    });
  }
};

/** Listar todas las relaciones Rol-Permiso */
export const getRolPermisos = async (_req: Request, res: Response) => {
  try {
    const relaciones = await RolPermiso.findAll({
      order: [["id", "DESC"]],
    });
    return res.json(relaciones);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener relaciones",
      error: error.message,
    });
  }
};

/** Obtener relación por ID */
export const getRolPermisoById = async (req: Request, res: Response) => {
  try {
    const relacion = await RolPermiso.findByPk(req.params.id);
    if (!relacion) {
      return res.status(404).json({ message: "Relación no encontrada" });
    }
    return res.json(relacion);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener la relación",
      error: error.message,
    });
  }
};

/** Eliminar relación por ID */
export const deleteRolPermiso = async (req: Request, res: Response) => {
  try {
    const rows = await RolPermiso.destroy({ where: { id: req.params.id } });
    if (rows === 0) {
      return res.status(404).json({ message: "Relación no encontrada" });
    }
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al eliminar la relación",
      error: error.message,
    });
  }
};
