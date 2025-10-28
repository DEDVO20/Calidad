import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { Usuario } from "../database";
import { config } from "../config/env";

/** Generar JWT token */
const generateToken = (userId: string, nombreUsuario: string): string => {
  const payload = {
    id: userId,
    nombreUsuario,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 horas
  };

  return jwt.sign(payload, config.jwt.secret);
};

/** Generar Refresh Token */
const generateRefreshToken = (userId: string): string => {
  const payload = {
    id: userId,
    type: "refresh",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 días
  };

  return jwt.sign(payload, config.jwt.secret);
};

/** Inicio de sesión */
export const login = async (req: Request, res: Response) => {
  try {
    const { usuario: usuarioOEmail, contrasena } = req.body;

    // Validar campos obligatorios
    if (!usuarioOEmail || !contrasena) {
      return res.status(400).json({
        message: "Usuario/Email/Documento y contraseña son obligatorios",
      });
    }

    // Construir condiciones de búsqueda
    const whereConditions: any[] = [
      { nombreUsuario: usuarioOEmail },
      { correoElectronico: usuarioOEmail },
    ];

    // Solo agregar búsqueda por documento si el valor es numérico
    const documentoNumerico = parseInt(usuarioOEmail, 10);
    if (
      !isNaN(documentoNumerico) &&
      documentoNumerico.toString() === usuarioOEmail.toString()
    ) {
      whereConditions.push({ documento: documentoNumerico });
    }

    // Buscar usuario en la base de datos por nombre de usuario O correo electrónico O documento
    const usuario = await Usuario.findOne({
      where: {
        [Op.or]: whereConditions,
      },
      attributes: [
        "id",
        "documento",
        "nombre",
        "segundoNombre",
        "primerApellido",
        "segundoApellido",
        "correoElectronico",
        "nombreUsuario",
        "contrasenaHash",
        "areaId",
        "activo",
      ],
    });

    if (!usuario) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      return res.status(401).json({
        message: "Usuario inactivo. Contacte al administrador.",
      });
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasenaHash,
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // Generar tokens
    const token = generateToken(usuario.id, usuario.nombreUsuario);
    const refreshToken = generateRefreshToken(usuario.id);

    // Respuesta exitosa (sin devolver la contraseña)
    const usuarioRespuesta = {
      id: usuario.id,
      documento: usuario.documento,
      nombre: usuario.nombre,
      segundoNombre: usuario.segundoNombre,
      primerApellido: usuario.primerApellido,
      segundoApellido: usuario.segundoApellido,
      correoElectronico: usuario.correoElectronico,
      nombreUsuario: usuario.nombreUsuario,
      areaId: usuario.areaId,
      activo: usuario.activo,
    };

    return res.status(200).json({
      message: "Login exitoso",
      user: usuarioRespuesta,
      token,
      refreshToken,
      expiresIn: "24h",
    });
  } catch (error: any) {
    console.error("Error en login:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: config.nodeEnv === "development" ? error.message : undefined,
    });
  }
};

/** Registro de usuario */
export const register = async (req: Request, res: Response) => {
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
    } = req.body;

    // Validar campos obligatorios
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
          "Faltan campos obligatorios: documento, nombre, primerApellido, correoElectronico, nombreUsuario y contrasena",
      });
    }

    // Verificar si el usuario ya existe (por nombreUsuario, correoElectronico o documento)
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [{ nombreUsuario }, { correoElectronico }, { documento }],
      },
    });

    if (usuarioExistente) {
      if (usuarioExistente.nombreUsuario === nombreUsuario) {
        return res.status(409).json({
          message: "El nombre de usuario ya existe",
        });
      }
      if (usuarioExistente.correoElectronico === correoElectronico) {
        return res.status(409).json({
          message: "El correo electrónico ya está registrado",
        });
      }
      if (usuarioExistente.documento === documento) {
        return res.status(409).json({
          message: "El número de documento ya está registrado",
        });
      }
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoElectronico)) {
      return res.status(400).json({
        message: "Formato de correo electrónico inválido",
      });
    }

    // Validar longitud de contraseña
    if (contrasena.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      documento,
      nombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      correoElectronico,
      nombreUsuario,
      contrasenaHash,
      areaId,
      activo: true,
    });

    // Respuesta exitosa (sin devolver la contraseña)
    const usuarioRespuesta = {
      id: nuevoUsuario.id,
      documento: nuevoUsuario.documento,
      nombre: nuevoUsuario.nombre,
      segundoNombre: nuevoUsuario.segundoNombre,
      primerApellido: nuevoUsuario.primerApellido,
      segundoApellido: nuevoUsuario.segundoApellido,
      correoElectronico: nuevoUsuario.correoElectronico,
      nombreUsuario: nuevoUsuario.nombreUsuario,
      areaId: nuevoUsuario.areaId,
      activo: nuevoUsuario.activo,
    };

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: usuarioRespuesta,
    });
  } catch (error: any) {
    console.error("Error en registro:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: config.nodeEnv === "development" ? error.message : undefined,
    });
  }
};

/** Renovar token */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: refreshTokenFromBody } = req.body;

    if (!refreshTokenFromBody) {
      return res.status(400).json({
        message: "Refresh token requerido",
      });
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshTokenFromBody, config.jwt.secret) as any;

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        message: "Usuario no válido o inactivo",
      });
    }

    // Generar nuevo access token
    const nuevoToken = generateToken(usuario.id, usuario.nombreUsuario);

    return res.status(200).json({
      message: "Token renovado exitosamente",
      token: nuevoToken,
      expiresIn: "24h",
    });
  } catch (error: any) {
    console.error("Error al renovar token:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Refresh token inválido o expirado",
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

/** Recuperar contraseña */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { correoElectronico } = req.body;

    if (!correoElectronico) {
      return res.status(400).json({
        message: "Correo electrónico requerido",
      });
    }

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({
      where: { correoElectronico },
    });

    if (!usuario) {
      // Por seguridad, no indicamos si el email existe o no
      return res.status(200).json({
        message:
          "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña",
      });
    }

    // Generar token de recuperación (válido por 1 hora)
    const resetToken = jwt.sign(
      {
        id: usuario.id,
        type: "reset",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
      },
      config.jwt.secret,
    );

    // TODO: Aquí deberías enviar el email con el token
    // Para desarrollo, log del token
    console.log(`Reset token para ${correoElectronico}: ${resetToken}`);

    return res.status(200).json({
      message:
        "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña",
      // En desarrollo, devolver el token para testing
      ...(config.nodeEnv === "development" && { resetToken }),
    });
  } catch (error: any) {
    console.error("Error en forgot password:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

/** Restablecer contraseña */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, nuevaContrasena } = req.body;

    if (!token || !nuevaContrasena) {
      return res.status(400).json({
        message: "Token y nueva contraseña son requeridos",
      });
    }

    if (nuevaContrasena.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Verificar token de reset
    const decoded = jwt.verify(token, config.jwt.secret) as any;

    if (decoded.type !== "reset") {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(401).json({
        message: "Usuario no encontrado",
      });
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    const contrasenaHash = await bcrypt.hash(nuevaContrasena, saltRounds);

    // Actualizar contraseña
    await usuario.update({ contrasenaHash });

    return res.status(200).json({
      message: "Contraseña restablecida exitosamente",
    });
  } catch (error: any) {
    console.error("Error al restablecer contraseña:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Token inválido o expirado",
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

/** Logout (invalidar token - en el frontend) */
export const logout = async (req: Request, res: Response) => {
  // En JWT, el logout se maneja típicamente en el frontend removiendo el token
  // Para un logout más seguro, podrías mantener una blacklist de tokens
  return res.status(200).json({
    message: "Logout exitoso. Token invalidado en el cliente.",
  });
};

/** Verificar token (middleware helper) */
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token no proporcionado",
      });
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    const decoded = jwt.verify(token, config.jwt.secret) as any;

    // Buscar usuario
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: ["id", "nombreUsuario", "activo"],
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        message: "Usuario no válido o inactivo",
      });
    }

    return res.status(200).json({
      valid: true,
      user: {
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
      },
    });
  } catch (error: any) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Token inválido o expirado",
        valid: false,
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Exportar funciones directamente
export default {
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  verifyToken,
};
