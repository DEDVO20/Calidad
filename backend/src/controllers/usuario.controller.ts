import { Request, Response } from "express";
import Usuario from "../models/Usuarios";
import bcrypt from "bcrypt";

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
      contrasena,
      areaId,
      activo,
    } = req.body;

    if (!documento || !nombre || !primerApellido || !correoElectronico || !nombreUsuario || !contrasena) {
      return res.status(400).json({
        message: "Los campos 'documento', 'nombre', 'primerApellido', 'correoElectronico', 'nombreUsuario' y 'contrasena' son obligatorios.",
      });
    }

    const nombreExiste = await Usuario.findOne({ where: { nombreUsuario } });
    if (nombreExiste) {
      return res.status(409).json({ message: "Ya existe un usuario con ese nombre de usuario." });
    }

    const documentoExiste = await Usuario.findOne({ where: { documento } });
    if (documentoExiste) {
      return res.status(409).json({ message: "Ya existe un usuario con ese documento." });
    }

    const saltRounds = 10;
    const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);

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
      activo: activo !== undefined ? activo : true,
    });

    const { contrasenaHash: _, ...usuarioSinHash } = usuario.toJSON();
    return res.status(201).json(usuarioSinHash);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al crear el usuario", error: error.message });
  }
};

/** Listar todos los usuarios */
export const getUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["contrasenaHash"] },
      order: [["creadoEn", "DESC"]],
    });
    return res.json(usuarios);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

/** Obtener usuario por ID */
export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["contrasenaHash"] },
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json(usuario);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
};

/** Actualizar usuario por ID */
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const {
      documento,
      nombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      correoElectronico,
      nombreUsuario,
      contrasena,
      areaId,
      activo,
    } = req.body;

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (nombreUsuario && nombreUsuario !== usuario.nombreUsuario) {
      const nombreExiste = await Usuario.findOne({ where: { nombreUsuario } });
      if (nombreExiste) {
        return res.status(409).json({ message: "Ya existe un usuario con ese nombre de usuario." });
      }
    }

    if (documento && documento !== usuario.documento) {
      const documentoExiste = await Usuario.findOne({ where: { documento } });
      if (documentoExiste) {
        return res.status(409).json({ message: "Ya existe un usuario con ese documento." });
      }
    }

    const datosActualizacion: any = {
      documento,
      nombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      correoElectronico,
      nombreUsuario,
      areaId,
      activo,
    };

    if (contrasena) {
      const saltRounds = 10;
      datosActualizacion.contrasenaHash = await bcrypt.hash(contrasena, saltRounds);
    }

    await usuario.update(datosActualizacion);

    const usuarioActualizado = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["contrasenaHash"] },
    });

    return res.json(usuarioActualizado);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
  }
};