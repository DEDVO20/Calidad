import { Request, Response } from "express";
import Usuario from "../models/usuario.model";
import Area from "../models/area.model";
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
      include: [
        {
          model: Area,
          as: "area",
          attributes: ["id", "codigo", "nombre", "descripcion"],
        },
      ],
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
      include: [
        {
          model: Area,
          as: "area",
          attributes: ["id", "codigo", "nombre", "descripcion"],
        },
      ],
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
      fotoUrl, // Agregado para Supabase
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

    // Manejar fotoUrl de Supabase (prioridad) o archivo local
    if (fotoUrl !== undefined) {
      // Si viene fotoUrl del body (Supabase), usarla directamente
      datosActualizacion.fotoUrl = fotoUrl;
    } else if (req.file) {
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
    }

    // Actualizar contraseña si viene en el body
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
      include: [
        {
          model: Area,
          as: "area",
          attributes: ["id", "codigo", "nombre", "descripcion"],
        },
      ],
    });

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

/**
 * Bulk import users from Excel or CSV file
 */
export const bulkImportUsuarios = async (req: Request, res: Response) => {
  const { BulkImportService } = await import('../services/bulkImport.service');

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó archivo' });
    }

    // Validar tipo de archivo
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'text/comma-separated-values'
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: 'Formato de archivo no válido. Use Excel (.xlsx) o CSV (.csv)'
      });
    }

    // Validar tamaño (5MB máx)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: 'El archivo excede el tamaño máximo de 5MB'
      });
    }

    // Parse archivo
    const rows = await BulkImportService.parseFile(
      req.file.buffer,
      req.file.mimetype
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'El archivo está vacío' });
    }

    if (rows.length > 1000) {
      return res.status(400).json({
        message: 'El archivo excede el límite de 1000 usuarios por importación'
      });
    }

    // Importar usuarios
    const result = await BulkImportService.importUsers(rows);

    return res.status(200).json(result);

  } catch (error: any) {
    console.error('Error en importación masiva:', error);
    return res.status(500).json({
      message: 'Error al procesar el archivo',
      error: error.message
    });
  }
};
