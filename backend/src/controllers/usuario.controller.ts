import { Request, Response } from "express";
import Usuario from "../models/usuario.model";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

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

    if (
      !documento ||
      !nombre ||
      !primerApellido ||
      !correoElectronico ||
      !nombreUsuario ||
      !contrasena
    ) {
      return res.status(400).json({
        message:
          "Los campos 'documento', 'nombre', 'primerApellido', 'correoElectronico', 'nombreUsuario' y 'contrasena' son obligatorios.",
      });
    }

    const nombreExiste = await Usuario.findOne({ where: { nombreUsuario } });
    if (nombreExiste) {
      return res
        .status(409)
        .json({ message: "Ya existe un usuario con ese nombre de usuario." });
    }

    const documentoExiste = await Usuario.findOne({ where: { documento } });
    if (documentoExiste) {
      return res
        .status(409)
        .json({ message: "Ya existe un usuario con ese documento." });
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
    return res
      .status(500)
      .json({ message: "Error al crear el usuario", error: error.message });
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
    return res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: error.message });
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
    return res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: error.message });
  }
};

/** Actualizar usuario por ID */
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    console.log('====== PATCH /usuarios/:id ======');
    console.log('📦 Content-Type:', req.headers['content-type']);
    console.log('📥 Body completo:', JSON.stringify(req.body, null, 2));
    console.log('🖼️ foto_url en body:', req.body.foto_url);
    console.log('📁 req.file:', req.file);
    
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
      foto_url, // Agregado para Supabase
    } = req.body;

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (nombreUsuario && nombreUsuario !== usuario.nombreUsuario) {
      const nombreExiste = await Usuario.findOne({ where: { nombreUsuario } });
      if (nombreExiste) {
        return res
          .status(409)
          .json({ message: "Ya existe un usuario con ese nombre de usuario." });
      }
    }

    if (documento && documento !== usuario.documento) {
      const documentoExiste = await Usuario.findOne({ where: { documento } });
      if (documentoExiste) {
        return res
          .status(409)
          .json({ message: "Ya existe un usuario con ese documento." });
      }
    }

    const datosActualizacion: any = {};

    // Solo actualizar campos que vengan en el request
    if (documento !== undefined) datosActualizacion.documento = documento;
    if (nombre !== undefined) datosActualizacion.nombre = nombre;
    if (segundoNombre !== undefined)
      datosActualizacion.segundoNombre = segundoNombre;
    if (primerApellido !== undefined)
      datosActualizacion.primerApellido = primerApellido;
    if (segundoApellido !== undefined)
      datosActualizacion.segundoApellido = segundoApellido;
    if (correoElectronico !== undefined)
      datosActualizacion.correoElectronico = correoElectronico;
    if (nombreUsuario !== undefined)
      datosActualizacion.nombreUsuario = nombreUsuario;
    if (areaId !== undefined) datosActualizacion.areaId = areaId;
    if (activo !== undefined)
      datosActualizacion.activo = activo === "true" || activo === true;

    // Manejar foto_url de Supabase (prioridad) o archivo local
    if (foto_url !== undefined) {
      console.log('✅ Guardando foto_url:', foto_url);
      // Si viene foto_url del body (Supabase), usarla directamente
      datosActualizacion.fotoUrl = foto_url;
    } else if (req.file) {
      console.log('📁 Guardando archivo local:', req.file.filename);
      // Si viene un archivo (upload local), guardar la ruta
      // Eliminar foto anterior si existe
      const oldFotoUrl = (usuario as any).fotoUrl;
      if (oldFotoUrl) {
        const oldFilePath = path.join(process.cwd(), oldFotoUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      // Guardar nueva URL de foto
      datosActualizacion.fotoUrl = `/uploads/profiles/${req.file.filename}`;
    } else {
      console.log('⚠️ No se recibió ni foto_url ni archivo');
    }

    console.log('💾 Datos a actualizar:', JSON.stringify(datosActualizacion, null, 2));

    if (contrasena) {
      const saltRounds = 10;
      datosActualizacion.contrasenaHash = await bcrypt.hash(
        contrasena,
        saltRounds,
      );
    }

    await usuario.update(datosActualizacion);

    const usuarioActualizado = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["contrasenaHash"] },
    });

    console.log('✅ Usuario actualizado:', JSON.stringify(usuarioActualizado, null, 2));
    console.log('====== FIN PATCH ======\n');

    return res.json(usuarioActualizado);
  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await usuario.destroy();

    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message,
    });
  }
};
