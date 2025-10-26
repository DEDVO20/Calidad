import { Request, Response } from "express";
import ParticipanteProceso from "../models/participanteProceso.model";

/** Crear un participante de proceso */
export const createParticipante = async (req: Request, res: Response) => {
  try {
    const { procesoId, usuarioId, rol } = req.body;

    if (!procesoId || !usuarioId) {
      return res
        .status(400)
        .json({ message: "Los campos 'procesoId' y 'usuarioId' son obligatorios." });
    }

    const existe = await ParticipanteProceso.findOne({
      where: { procesoId, usuarioId },
    });

    if (existe) {
      return res
        .status(409)
        .json({ message: "El usuario ya está asignado a este proceso." });
    }

    const nuevo = await ParticipanteProceso.create({ procesoId, usuarioId, rol });
    return res.status(201).json(nuevo);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear el participante del proceso",
      error: error.message,
    });
  }
};

/** Listar todos los participantes */
export const getParticipantes = async (req: Request, res: Response) => {
  try {
    const lista = await ParticipanteProceso.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.json(lista);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener los participantes de procesos",
      error: error.message,
    });
  }
};

/** Obtener un participante por ID */
export const getParticipanteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const participante = await ParticipanteProceso.findByPk(id);

    if (!participante)
      return res.status(404).json({ message: "Participante no encontrado." });

    return res.json(participante);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener el participante",
      error: error.message,
    });
  }
};

/** Actualizar un participante */
export const updateParticipante = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const participante = await ParticipanteProceso.findByPk(id);
    if (!participante)
      return res.status(404).json({ message: "Participante no encontrado." });

    await participante.update({ rol });
    return res.json(participante);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el participante",
      error: error.message,
    });
  }
};

/** Eliminar un participante */
export const deleteParticipante = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const participante = await ParticipanteProceso.findByPk(id);

    if (!participante)
      return res.status(404).json({ message: "Participante no encontrado." });

    await participante.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al eliminar el participante",
      error: error.message,
    });
  }
};
