import { Request, Response } from "express";
import UsuarioRol from "../models/usuarioRol.model";

export const createUsuarioRol = async (req: Request, res: Response) => {
  try {
    const { usuarioId, rolId, areaId, asignadoPor } = req.body;

    const usuarioRol = await UsuarioRol.create({
      usuarioId,
      rolId,
      areaId,
      asignadoPor,
    });

    res.status(201).json(usuarioRol);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la asignación de rol", error });
  }
};

export const getAllUsuarioRoles = async (req: Request, res: Response) => {
  try {
    const usuarioRoles = await UsuarioRol.findAll();
    res.status(200).json(usuarioRoles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las asignaciones de roles", error });
  }
};

export const getUsuarioRolById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioRol = await UsuarioRol.findByPk(id);

    if (!usuarioRol) {
      return res
        .status(404)
        .json({ message: "Asignación de rol no encontrada" });
    }

    res.status(200).json(usuarioRol);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la asignación de rol", error });
  }
};

export const getRolesByUsuario = async (req: Request, res: Response) => {
  try {
    const { usuarioId } = req.params;
    const roles = await UsuarioRol.findAll({
      where: { usuarioId },
    });
    res.status(200).json(roles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los roles del usuario", error });
  }
};

export const getUsuariosByRol = async (req: Request, res: Response) => {
  try {
    const { rolId } = req.params;
    const usuarios = await UsuarioRol.findAll({
      where: { rolId },
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los usuarios del rol", error });
  }
};

export const getUsuarioRolesByArea = async (req: Request, res: Response) => {
  try {
    const { areaId } = req.params;
    const usuarioRoles = await UsuarioRol.findAll({
      where: { areaId },
    });
    res.status(200).json(usuarioRoles);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener las asignaciones de roles del área",
        error,
      });
  }
};

export const updateUsuarioRol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { usuarioId, rolId, areaId, asignadoPor } = req.body;

    const usuarioRol = await UsuarioRol.findByPk(id);

    if (!usuarioRol) {
      return res
        .status(404)
        .json({ message: "Asignación de rol no encontrada" });
    }

    await usuarioRol.update({
      usuarioId,
      rolId,
      areaId,
      asignadoPor,
    });

    res.status(200).json(usuarioRol);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la asignación de rol", error });
  }
};

export const deleteUsuarioRol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioRol = await UsuarioRol.findByPk(id);

    if (!usuarioRol) {
      return res
        .status(404)
        .json({ message: "Asignación de rol no encontrada" });
    }

    await usuarioRol.destroy();
    res
      .status(200)
      .json({ message: "Asignación de rol eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la asignación de rol", error });
  }
};

export const deleteRolesByUsuario = async (req: Request, res: Response) => {
  try {
    const { usuarioId } = req.params;
    const deletedCount = await UsuarioRol.destroy({
      where: { usuarioId },
    });

    res.status(200).json({
      message: `${deletedCount} asignaciones de roles eliminadas correctamente`,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al eliminar las asignaciones de roles del usuario",
        error,
      });
  }
};
