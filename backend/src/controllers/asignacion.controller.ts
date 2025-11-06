import { Request, Response } from "express";
import Asignacion from "../models/asignacion.model";
import Area from "../models/area.model";
import Usuario from "../models/usuario.model";

// Función helper para formatear el nombre completo del usuario
const formatUsuarioNombre = (usuario: any): string => {
  const partes = [
    usuario.nombre,
    usuario.segundoNombre,
    usuario.primerApellido,
    usuario.segundoApellido,
  ].filter(Boolean);
  return partes.join(" ");
};

// Función helper para formatear la respuesta de asignación
const formatAsignacionResponse = (asignacion: any) => {
  const usuarioNombre = formatUsuarioNombre(asignacion.usuario);

  return {
    id: asignacion.id,
    areaId: asignacion.areaId,
    usuarioId: asignacion.usuarioId,
    esPrincipal: asignacion.esPrincipal,
    creadoEn: asignacion.creadoEn,
    area: {
      id: asignacion.area.id,
      codigo: asignacion.area.codigo,
      nombre: asignacion.area.nombre,
      descripcion: asignacion.area.descripcion,
    },
    usuario: {
      id: asignacion.usuario.id,
      nombre: usuarioNombre,
      email: asignacion.usuario.correoElectronico,
      rol: "Usuario", // Por defecto, podría mejorarse consultando los roles del usuario
    },
  };
};

export const createAsignacion = async (req: Request, res: Response) => {
  try {
    const { areaId, usuarioId, esPrincipal } = req.body;

    // Validar que se proporcionen los campos requeridos
    if (!areaId || !usuarioId) {
      return res.status(400).json({
        message: "Los campos areaId y usuarioId son requeridos",
      });
    }

    // Verificar que el área existe
    const area = await Area.findByPk(areaId);
    if (!area) {
      return res.status(404).json({ message: "Área no encontrada" });
    }

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si ya existe la asignación
    const asignacionExistente = await Asignacion.findOne({
      where: { areaId, usuarioId },
    });

    if (asignacionExistente) {
      return res.status(400).json({
        message: "Esta asignación ya existe",
      });
    }

    // Crear la asignación
    const asignacion = await Asignacion.create({
      areaId,
      usuarioId,
      esPrincipal: esPrincipal || false,
    });

    // Obtener la asignación con las relaciones
    const asignacionCompleta = await Asignacion.findByPk(asignacion.id, {
      include: [
        {
          model: Area,
          as: "area",
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: { exclude: ["contrasenaHash"] },
        },
      ],
    });

    const response = formatAsignacionResponse(asignacionCompleta);
    res.status(201).json(response);
  } catch (error: any) {
    console.error("Error al crear asignación:", error);
    res.status(500).json({
      message: "Error al crear la asignación",
      error: error.message,
    });
  }
};

export const getAllAsignaciones = async (req: Request, res: Response) => {
  try {
    const asignaciones = await Asignacion.findAll({
      include: [
        {
          model: Area,
          as: "area",
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: { exclude: ["contrasenaHash"] },
        },
      ],
      order: [["creadoEn", "DESC"]],
    });

    const response = asignaciones.map(formatAsignacionResponse);
    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error al obtener asignaciones:", error);
    res.status(500).json({
      message: "Error al obtener las asignaciones",
      error: error.message,
    });
  }
};

export const getAsignacionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const asignacion = await Asignacion.findByPk(id, {
      include: [
        {
          model: Area,
          as: "area",
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: { exclude: ["contrasenaHash"] },
        },
      ],
    });

    if (!asignacion) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }

    const response = formatAsignacionResponse(asignacion);
    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error al obtener asignación:", error);
    res.status(500).json({
      message: "Error al obtener la asignación",
      error: error.message,
    });
  }
};

export const getAsignacionesByArea = async (req: Request, res: Response) => {
  try {
    const { areaId } = req.params;

    const asignaciones = await Asignacion.findAll({
      where: { areaId },
      include: [
        {
          model: Area,
          as: "area",
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: { exclude: ["contrasenaHash"] },
        },
      ],
      order: [
        ["esPrincipal", "DESC"],
        ["creadoEn", "DESC"],
      ],
    });

    const response = asignaciones.map(formatAsignacionResponse);
    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error al obtener asignaciones por área:", error);
    res.status(500).json({
      message: "Error al obtener las asignaciones del área",
      error: error.message,
    });
  }
};

export const getAsignacionesByUsuario = async (req: Request, res: Response) => {
  try {
    const { usuarioId } = req.params;

    const asignaciones = await Asignacion.findAll({
      where: { usuarioId },
      include: [
        {
          model: Area,
          as: "area",
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: { exclude: ["contrasenaHash"] },
        },
      ],
      order: [
        ["esPrincipal", "DESC"],
        ["creadoEn", "DESC"],
      ],
    });

    const response = asignaciones.map(formatAsignacionResponse);
    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error al obtener asignaciones por usuario:", error);
    res.status(500).json({
      message: "Error al obtener las asignaciones del usuario",
      error: error.message,
    });
  }
};

export const updateAsignacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { areaId, usuarioId, esPrincipal } = req.body;

    const asignacion = await Asignacion.findByPk(id);

    if (!asignacion) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }

    // Si se actualiza el área o usuario, verificar que existan
    if (areaId && areaId !== asignacion.areaId) {
      const area = await Area.findByPk(areaId);
      if (!area) {
        return res.status(404).json({ message: "Área no encontrada" });
      }
    }

    if (usuarioId && usuarioId !== asignacion.usuarioId) {
      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    }

    // Actualizar la asignación
    await asignacion.update({
      areaId: areaId || asignacion.areaId,
      usuarioId: usuarioId || asignacion.usuarioId,
      esPrincipal:
        esPrincipal !== undefined ? esPrincipal : asignacion.esPrincipal,
    });

    // Obtener la asignación actualizada con las relaciones
    const asignacionActualizada = await Asignacion.findByPk(id, {
      include: [
        {
          model: Area,
          as: "area",
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: { exclude: ["contrasenaHash"] },
        },
      ],
    });

    const response = formatAsignacionResponse(asignacionActualizada);
    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error al actualizar asignación:", error);
    res.status(500).json({
      message: "Error al actualizar la asignación",
      error: error.message,
    });
  }
};

export const deleteAsignacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const asignacion = await Asignacion.findByPk(id);

    if (!asignacion) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }

    await asignacion.destroy();

    res.status(200).json({
      message: "Asignación eliminada correctamente",
    });
  } catch (error: any) {
    console.error("Error al eliminar asignación:", error);
    res.status(500).json({
      message: "Error al eliminar la asignación",
      error: error.message,
    });
  }
};

export const deleteAsignacionesByArea = async (req: Request, res: Response) => {
  try {
    const { areaId } = req.params;

    const deletedCount = await Asignacion.destroy({
      where: { areaId },
    });

    res.status(200).json({
      message: `${deletedCount} asignaciones eliminadas correctamente`,
    });
  } catch (error: any) {
    console.error("Error al eliminar asignaciones por área:", error);
    res.status(500).json({
      message: "Error al eliminar las asignaciones del área",
      error: error.message,
    });
  }
};

export const deleteAsignacionesByUsuario = async (
  req: Request,
  res: Response,
) => {
  try {
    const { usuarioId } = req.params;

    const deletedCount = await Asignacion.destroy({
      where: { usuarioId },
    });

    res.status(200).json({
      message: `${deletedCount} asignaciones eliminadas correctamente`,
    });
  } catch (error: any) {
    console.error("Error al eliminar asignaciones por usuario:", error);
    res.status(500).json({
      message: "Error al eliminar las asignaciones del usuario",
      error: error.message,
    });
  }
};
