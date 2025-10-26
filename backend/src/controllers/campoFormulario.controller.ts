import { Request, Response } from "express";
import CampoFormulario from "../models/campoFormulario.model";

/** Crear campo de formulario */
export const createCampoFormulario = async (req: Request, res: Response) => {
  try {
    const {
      procesoId,
      nombre,
      claveCampo,
      tipoCampo,
      obligatorio,
      orden,
      configuracion,
    } = req.body;

    if (!procesoId || !nombre || !claveCampo || !tipoCampo) {
      return res.status(400).json({
        message: "Los campos 'procesoId', 'nombre', 'claveCampo' y 'tipoCampo' son obligatorios.",
      });
    }

    const campoFormulario = await CampoFormulario.create({
      procesoId,
      nombre,
      claveCampo,
      tipoCampo,
      obligatorio: obligatorio !== undefined ? obligatorio : false,
      orden: orden !== undefined ? orden : 0,
      configuracion,
    });

    return res.status(201).json(campoFormulario);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear el campo de formulario",
      error: error.message,
    });
  }
};

/** Listar todos los campos de formulario */
export const getCamposFormulario = async (_req: Request, res: Response) => {
  try {
    const camposFormulario = await CampoFormulario.findAll({
      order: [["orden", "ASC"]],
    });
    return res.json(camposFormulario);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener campos de formulario",
      error: error.message,
    });
  }
};

/** Obtener campo de formulario por ID */
export const getCampoFormularioById = async (req: Request, res: Response) => {
  try {
    const campoFormulario = await CampoFormulario.findByPk(req.params.id);
    if (!campoFormulario) {
      return res.status(404).json({
        message: "Campo de formulario no encontrado",
      });
    }
    return res.json(campoFormulario);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener el campo de formulario",
      error: error.message,
    });
  }
};

/** Actualizar campo de formulario por ID */
export const updateCampoFormulario = async (req: Request, res: Response) => {
  try {
    const {
      procesoId,
      nombre,
      claveCampo,
      tipoCampo,
      obligatorio,
      orden,
      configuracion,
    } = req.body;

    const campoFormulario = await CampoFormulario.findByPk(req.params.id);
    if (!campoFormulario) {
      return res.status(404).json({
        message: "Campo de formulario no encontrado",
      });
    }

    await campoFormulario.update({
      procesoId,
      nombre,
      claveCampo,
      tipoCampo,
      obligatorio,
      orden,
      configuracion,
    });

    return res.json(campoFormulario);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar el campo de formulario",
      error: error.message,
    });
  }
};