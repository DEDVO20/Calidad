import { Request, Response } from "express";
import Rol from "../models/rol.model";

/** Crear rol */
export const createRol = async (req: Request, res: Response) => {
  try {
    const { nombre, clave, descripcion } = req.body;

    if (!nombre || !clave) {
      return res
        .status(400)
        .json({ message: "Los campos 'nombre' y 'clave' son obligatorios." });
    }

    // (Opcional) evitar duplicados por clave
    const existe = await Rol.findOne({ where: { clave } });
    if (existe) {
      return res
        .status(409)
        .json({ message: "Ya existe un rol con esa clave." });
    }

    const rol = await Rol.create({ nombre, clave, descripcion });
    return res.status(201).json(rol);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al crear rol", error: error.message });
  }
};

/** Listar roles */
export const getRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await Rol.findAll({
      order: [["creadoEn", "DESC"]],
    });
    return res.json(roles);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener roles", error: error.message });
  }
};

/** Obtener rol por ID con sus relaciones */
export const getRolById = async (req: Request, res: Response) => {
  try {
    const rol = await Rol.findByPk(req.params.id, {
      include: [{ association: "usuarios" }, { association: "permisos" }],
    });
    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });
    return res.json(rol);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener rol", error: error.message });
  }
};

/** Actualizar rol por ID */
export const updateRol = async (req: Request, res: Response) => {
  try {
    const { nombre, clave, descripcion } = req.body;
    const rol = await Rol.findByPk(req.params.id);
    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

    // (Opcional) validar clave única si la cambian
    if (clave && clave !== rol.clave) {
      const existe = await Rol.findOne({ where: { clave } });
      if (existe) {
        return res
          .status(409)
          .json({ message: "Ya existe un rol con esa clave." });
      }
    }

    await rol.update({ nombre, clave, descripcion });
    return res.json(rol);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al actualizar rol", error: error.message });
  }
};

/** Eliminar rol por ID */
export const deleteRol = async (req: Request, res: Response) => {
  try {
    const rows = await Rol.destroy({ where: { id: req.params.id } });
    if (rows === 0)
      return res.status(404).json({ message: "Rol no encontrado" });
    return res.status(204).send();
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al eliminar rol", error: error.message });
  }
};

/* ---------- Opcional: asignar/quitar permisos a un rol ---------- */

/** Asignar permisos a un rol (array de permisoId) */
export const addPermisosToRol = async (req: Request, res: Response) => {
  try {
    const { permisoIds } = req.body as { permisoIds: string[] };
    if (!Array.isArray(permisoIds) || permisoIds.length === 0) {
      return res
        .status(400)
        .json({ message: "permisoIds debe ser un array no vacío" });
    }

    const rol = await Rol.findByPk(req.params.id);
    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

    // Necesita que la asociación 'permisos' exista y Sequelize haya hecho mixins (addPermisos)
    // Si tu alias es "permisos", el método debería ser addPermisos
    // @ts-ignore (por los mixins no tipados)
    await rol.addPermisos(permisoIds);

    // @ts-ignore
    const actualizado = await Rol.findByPk(req.params.id, {
      include: [{ association: "permisos" }],
    });
    return res.json(actualizado);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al asignar permisos", error: error.message });
  }
};

/** Quitar permisos de un rol (array de permisoId) */
export const removePermisosFromRol = async (req: Request, res: Response) => {
  try {
    const { permisoIds } = req.body as { permisoIds: string[] };
    if (!Array.isArray(permisoIds) || permisoIds.length === 0) {
      return res
        .status(400)
        .json({ message: "permisoIds debe ser un array no vacío" });
    }

    const rol = await Rol.findByPk(req.params.id);
    if (!rol) return res.status(404).json({ message: "Rol no encontrado" });

    // @ts-ignore
    await rol.removePermisos(permisoIds);

    // @ts-ignore
    const actualizado = await Rol.findByPk(req.params.id, {
      include: [{ association: "permisos" }],
    });
    return res.json(actualizado);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al remover permisos", error: error.message });
  }
};
