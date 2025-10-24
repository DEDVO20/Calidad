import { Request, Response } from "express";
import Permiso from "../models/permiso.model";

/** Crear permiso */
export const createPermiso = async (req: Request, res: Response) => {
  try {
    const { nombre, codigo, descripcion } = req.body;

    if (!nombre || !codigo) {
      return res
        .status(400)
        .json({ message: "Los campos 'nombre' y 'codigo' son obligatorios." });
    }

    // (Opcional) Evitar duplicados por código
    const existe = await Permiso.findOne({ where: { codigo } });
    if (existe) {
      return res
        .status(409)
        .json({ message: "Ya existe un permiso con ese código." });
    }

    const permiso = await Permiso.create({ nombre, codigo, descripcion });
    return res.status(201).json(permiso);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al crear permiso", error: error.message });
  }
};

/** Listar permisos */
export const getPermisos = async (_req: Request, res: Response) => {
  try {
    const permisos = await Permiso.findAll({ order: [["creadoEn", "DESC"]] });
    return res.json(permisos);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener permisos", error: error.message });
  }
};

/** Obtener permiso por ID */
export const getPermisoById = async (req: Request, res: Response) => {
  try {
    const permiso = await Permiso.findByPk(req.params.id, {
      include: [{ association: "roles" }],
    });
    if (!permiso) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }
    return res.json(permiso);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener permiso", error: error.message });
  }
};

/** Actualizar permiso por ID */
export const updatePermiso = async (req: Request, res: Response) => {
  try {
    const { nombre, codigo, descripcion } = req.body;
    const permiso = await Permiso.findByPk(req.params.id);
    if (!permiso) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }

    // (Opcional) validar código único si lo cambian
    if (codigo && codigo !== permiso.codigo) {
      const existe = await Permiso.findOne({ where: { codigo } });
      if (existe) {
        return res
          .status(409)
          .json({ message: "Ya existe un permiso con ese código." });
      }
    }

    await permiso.update({ nombre, codigo, descripcion });
    return res.json(permiso);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al actualizar permiso", error: error.message });
  }
};

/** Eliminar permiso por ID */
export const deletePermiso = async (req: Request, res: Response) => {
  try {
    const rows = await Permiso.destroy({ where: { id: req.params.id } });
    if (rows === 0) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }
    return res.status(204).send();
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al eliminar permiso", error: error.message });
  }
};
