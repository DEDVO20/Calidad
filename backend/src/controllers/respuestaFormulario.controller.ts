import { Request, Response } from "express";
import RespuestaFormulario from "../models/respuestaFormulario.model";

/*Crear respuesta del formulario */
export const createRespuestaFormulario = async (
  req: Request,
  res: Response,
) => {
  try {
    const { instanciaId, campoId, valor } = req.body;
    const respuestaFormulario = await RespuestaFormulario.create({
      instanciaId,
      campoId,
      valor,
    });
    res.status(201).json(respuestaFormulario);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la respuesta del formulario", error });
  }
};

/*Obtener respuesta del formulario por ID */
export const getRespuestaFormularioById = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const respuestaFormulario = await RespuestaFormulario.findByPk(id);
    if (!respuestaFormulario) {
      return res
        .status(404)
        .json({ message: "Respuesta del formulario no encontrada" });
    }
    res.status(200).json(respuestaFormulario);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la respuesta del formulario", error });
  }
};

/*Obtener todas las respuestas del formulario */
export const getAllRespuestasFormulario = async (
  req: Request,
  res: Response,
) => {
  try {
    const respuestas = await RespuestaFormulario.findAll();
    res.status(200).json(respuestas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las respuestas del formulario",
      error,
    });
  }
};

/*Obtener todas las respuestas del formulario por instancia */
export const getRespuestasByInstancia = async (req: Request, res: Response) => {
  try {
    const { instanciaId } = req.params;
    const respuestas = await RespuestaFormulario.findAll({
      where: { instanciaId },
    });
    res.status(200).json(respuestas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las respuestas de la instancia",
      error,
    });
  }
};

/*Actualizar respuesta del formulario */
export const updateRespuestaFormulario = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { instanciaId, campoId, valor } = req.body;

    const respuestaFormulario = await RespuestaFormulario.findByPk(id);
    if (!respuestaFormulario) {
      return res
        .status(404)
        .json({ message: "Respuesta del formulario no encontrada" });
    }

    await respuestaFormulario.update({
      instanciaId,
      campoId,
      valor,
    });

    res.status(200).json(respuestaFormulario);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la respuesta del formulario",
      error,
    });
  }
};

/*Eliminar respuesta del formulario */
export const deleteRespuestaFormulario = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const respuestaFormulario = await RespuestaFormulario.findByPk(id);
    if (!respuestaFormulario) {
      return res
        .status(404)
        .json({ message: "Respuesta del formulario no encontrada" });
    }

    await respuestaFormulario.destroy();
    res
      .status(200)
      .json({ message: "Respuesta del formulario eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la respuesta del formulario",
      error,
    });
  }
};
