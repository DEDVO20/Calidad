import { Request, Response } from "express";
import { Usuario } from "../database";

/** Crear usuario */
export const createUsuario = async (req: Request, res: Response) => {
  try {
    const {
      documento,
      nombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      correoElectronico,
      nombreUsuario,
      contrasenaHash,
      areaId,
      activo,
    } = req.body;

    if (
      !documento ||
      !nombre ||
      !primerApellido ||
      !correoElectronico ||
      !nombreUsuario ||
      !contrasenaHash
    ) {
      return res.status(400).json({
        message:
          "Faltan campos obligatorios: documento, nombre, primerApellido, correoElectronico, nombreUsuario y contrasenaHash",
      });
    }

    const usuarioExistente = await Usuario.findOne({
      where: { nombreUsuario },
    });
    if (usuarioExistente) {
      return res
        .status(409)
        .json({ message: "El nombre de usuario ya existe." });
    }

    const usuario = await Usuario.create({
      documento,
      nombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      correoElectronico,
      nombreUsuario,
      contrasenaHash,
      areaId,
      activo,
    });

    return res.status(201).json(usuario);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message,
    });
  }
};

/** Listar todos los usuarios */
export const getUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.findAll({ order: [["creadoEn", "DESC"]] });
    return res.json(usuarios);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener los usuarios",
      error: error.message,
    });
  }
};

/** Obtener usuario por ID */
export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json(usuario);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener el usuario",
      error: error.message,
    });
  }
};

/** Actualizar usuario por ID */
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    await usuario.update(req.body);
    return res.json(usuario);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

/** Eliminar usuario por ID */
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    await usuario.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message,
    });
  }
};
