import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { Usuario } from "../database";

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        nombreUsuario: string;
        areaId?: string;
        activo: boolean;
      };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    nombreUsuario: string;
    areaId?: string;
    activo: boolean;
  };
}

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y el usuario esté activo
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Token de autorización requerido",
        error: "MISSING_TOKEN",
      });
      return;
    }

    // Extraer el token (remover "Bearer ")
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        message: "Token de autorización inválido",
        error: "INVALID_TOKEN_FORMAT",
      });
      return;
    }

    // Verificar el token JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (jwtError: any) {
      if (jwtError.name === "TokenExpiredError") {
        res.status(401).json({
          message: "Token expirado",
          error: "TOKEN_EXPIRED",
        });
        return;
      } else if (jwtError.name === "JsonWebTokenError") {
        res.status(401).json({
          message: "Token inválido",
          error: "INVALID_TOKEN",
        });
        return;
      } else {
        throw jwtError;
      }
    }

    // Verificar que el token tenga la estructura correcta
    if (!decoded.id || !decoded.nombreUsuario) {
      res.status(401).json({
        message: "Estructura de token inválida",
        error: "INVALID_TOKEN_STRUCTURE",
      });
      return;
    }

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: ["id", "nombreUsuario", "areaId", "activo"],
    });

    if (!usuario) {
      res.status(401).json({
        message: "Usuario no encontrado",
        error: "USER_NOT_FOUND",
      });
      return;
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      res.status(401).json({
        message: "Usuario inactivo. Contacte al administrador.",
        error: "USER_INACTIVE",
      });
      return;
    }

    // Agregar información del usuario al request
    req.user = {
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      areaId: usuario.areaId,
      activo: usuario.activo,
    };

    // Continuar al siguiente middleware/controlador
    next();
  } catch (error: any) {
    console.error("Error en middleware de autenticación:", error);
    res.status(500).json({
      message: "Error interno del servidor en autenticación",
      error:
        config.nodeEnv === "development" ? error.message : "INTERNAL_ERROR",
    });
  }
};

/**
 * Middleware opcional de autenticación
 * Si hay token, lo verifica, pero no bloquea si no hay token
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No hay token, pero continuamos
      next();
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      next();
      return;
    }

    try {
      const decoded: any = jwt.verify(token, config.jwt.secret);

      if (decoded.id && decoded.nombreUsuario) {
        const usuario = await Usuario.findByPk(decoded.id, {
          attributes: ["id", "nombreUsuario", "areaId", "activo"],
        });

        if (usuario && usuario.activo) {
          req.user = {
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            areaId: usuario.areaId,
            activo: usuario.activo,
          };
        }
      }
    } catch (jwtError) {
      // Ignorar errores de JWT en modo opcional
      console.warn("Token opcional inválido:", jwtError);
    }

    next();
  } catch (error: any) {
    console.error("Error en middleware de autenticación opcional:", error);
    // En modo opcional, continuamos incluso si hay error
    next();
  }
};

/**
 * Middleware para verificar roles específicos
 * Debe usarse después del authMiddleware
 */
export const requireRole = (roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          message: "Autenticación requerida",
          error: "AUTHENTICATION_REQUIRED",
        });
        return;
      }

      // TODO: Implementar verificación de roles cuando se tenga la relación usuario-rol
      // Por ahora, permitir a todos los usuarios autenticados
      next();
    } catch (error: any) {
      console.error("Error en middleware de roles:", error);
      res.status(500).json({
        message: "Error interno del servidor en verificación de roles",
        error:
          config.nodeEnv === "development" ? error.message : "INTERNAL_ERROR",
      });
    }
  };
};

/**
 * Middleware para verificar permisos específicos
 * Debe usarse después del authMiddleware
 */
export const requirePermission = (permissions: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          message: "Autenticación requerida",
          error: "AUTHENTICATION_REQUIRED",
        });
        return;
      }

      // TODO: Implementar verificación de permisos cuando se tenga la relación usuario-rol-permiso
      // Por ahora, permitir a todos los usuarios autenticados
      next();
    } catch (error: any) {
      console.error("Error en middleware de permisos:", error);
      res.status(500).json({
        message: "Error interno del servidor en verificación de permisos",
        error:
          config.nodeEnv === "development" ? error.message : "INTERNAL_ERROR",
      });
    }
  };
};

/**
 * Middleware para verificar que el usuario sea el propietario del recurso
 * o tenga permisos de administrador
 */
export const requireOwnershipOrAdmin = (userIdField: string = "usuarioId") => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          message: "Autenticación requerida",
          error: "AUTHENTICATION_REQUIRED",
        });
        return;
      }

      const resourceUserId = req.params[userIdField] || req.body[userIdField];

      if (req.user.id !== resourceUserId) {
        // TODO: Verificar si es administrador
        res.status(403).json({
          message: "No tiene permisos para acceder a este recurso",
          error: "INSUFFICIENT_PERMISSIONS",
        });
        return;
      }

      next();
    } catch (error: any) {
      console.error("Error en middleware de propiedad:", error);
      res.status(500).json({
        message: "Error interno del servidor en verificación de propiedad",
        error:
          config.nodeEnv === "development" ? error.message : "INTERNAL_ERROR",
      });
    }
  };
};

export default authMiddleware;
