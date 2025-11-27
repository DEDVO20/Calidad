import { Request, Response } from "express";
import Capacitacion from "../models/capacitacion.model";
import Usuario from "../models/usuario.model";

/** Crear una nueva Capacitación */
export const createCapacitacion = async (req: Request, res: Response) => {
  try {
    const {
      codigo,
      nombre,
      descripcion,
      tipoCapacitacion,
      modalidad,
      instructor,
      duracionHoras,
      fechaProgramada,
      fechaRealizacion,
      lugar,
      estado,
      objetivo,
      contenido,
      responsableId,
    } = req.body;

    // Validación mínima
    if (!codigo || !nombre || !tipoCapacitacion || !modalidad) {
      return res.status(400).json({
        message:
          "Los campos 'codigo', 'nombre', 'tipoCapacitacion' y 'modalidad' son obligatorios.",
      });
    }

    const nueva = await Capacitacion.create({
      codigo,
      nombre,
      descripcion,
      tipoCapacitacion,
      modalidad,
      instructor,
      duracionHoras,
      fechaProgramada,
      fechaRealizacion,
      lugar,
      estado: estado || "programada",
      objetivo,
      contenido,
      responsableId,
    });

    return res.status(201).json(nueva);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear la capacitación.",
      error: error.message,
    });
  }
};

/** Listar todas las Capacitaciones */
export const getCapacitaciones = async (req: Request, res: Response) => {
  try {
    const { tipo, estado, modalidad } = req.query;

    // Build dynamic where clause based on query parameters
    const whereClause: any = {};

    if (tipo) {
      whereClause.tipoCapacitacion = tipo;
    }
    if (estado) {
      whereClause.estado = estado;
    }
    if (modalidad) {
      whereClause.modalidad = modalidad;
    }

    const lista = await Capacitacion.findAll({
      where: whereClause,
      // TODO: Re-enable when associations are properly configured
      // include: [
      //   {
      //     model: Usuario,
      //     as: "responsable",
      //     required: false,
      //     attributes: ["id", "nombre", "primerApellido", "segundoApellido", "email"],
      //   },
      // ],
      order: [["creadoEn", "DESC"]],
    });

    return res.json(lista);
  } catch (error: any) {
    console.error("Error en getCapacitaciones:", error);
    console.error("Stack trace:", error.stack);
    return res.status(500).json({
      message: "Error al obtener las capacitaciones.",
      error: error.message,
    });
  }
};

/** Obtener una Capacitación por ID */
export const getCapacitacionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cap = await Capacitacion.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: "responsable",
          attributes: [
            "id",
            "nombre",
            "primerApellido",
            "segundoApellido",
            "email",
          ],
        },
      ],
    });

    if (!cap) {
      return res.status(404).json({
        message: "Capacitación no encontrada.",
      });
    }

    return res.json(cap);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener la capacitación.",
      error: error.message,
    });
  }
};

/** Actualizar una Capacitación */
export const updateCapacitacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      codigo,
      nombre,
      descripcion,
      tipoCapacitacion,
      modalidad,
      instructor,
      duracionHoras,
      fechaProgramada,
      fechaRealizacion,
      lugar,
      estado,
      objetivo,
      contenido,
      responsableId,
    } = req.body;

    const cap = await Capacitacion.findByPk(id);
    if (!cap) {
      return res.status(404).json({
        message: "Capacitación no encontrada.",
      });
    }

    await cap.update({
      codigo,
      nombre,
      descripcion,
      tipoCapacitacion,
      modalidad,
      instructor,
      duracionHoras,
      fechaProgramada,
      fechaRealizacion,
      lugar,
      estado,
      objetivo,
      contenido,
      responsableId,
      actualizadoEn: new Date(),
    });

    return res.json(cap);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar la capacitación.",
      error: error.message,
    });
  }
};

/** Eliminar una Capacitación */
export const deleteCapacitacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cap = await Capacitacion.findByPk(id);

    if (!cap) {
      return res.status(404).json({
        message: "Capacitación no encontrada.",
      });
    }

    await cap.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al eliminar la capacitación.",
      error: error.message,
    });
  }
};
