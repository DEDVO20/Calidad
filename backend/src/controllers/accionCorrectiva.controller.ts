import { Request, Response } from "express";
import AccionCorrectiva from "../models/accionCorrectiva.model";

/** Crear acción correctiva */
export const createAccionCorrectiva = async (req: Request, res: Response) => {
  try {
    const {
      noConformidadId,
      codigo,
      tipo,
      descripcion,
      analisisCausaRaiz,
      planAccion,
      responsableId,
      fechaCompromiso,
      fechaImplementacion,
      estado,
      eficaciaVerificada,
      verificadoPor,
      fechaVerificacion,
      observacion,
    } = req.body;

    if (!noConformidadId || !codigo) {
      return res.status(400).json({
        message: "Los campos 'noConformidadId' y 'codigo' son obligatorios.",
      });
    }

    const codigoExiste = await AccionCorrectiva.findOne({ where: { codigo } });
    if (codigoExiste) {
      return res.status(409).json({
        message: "Ya existe una acción correctiva con ese código.",
      });
    }

    const accionCorrectiva = await AccionCorrectiva.create({
      noConformidadId,
      codigo,
      tipo,
      descripcion,
      analisisCausaRaiz,
      planAccion,
      responsableId,
      fechaCompromiso,
      fechaImplementacion,
      estado,
      eficaciaVerificada,
      verificadoPor,
      fechaVerificacion,
      observacion,
    });

    return res.status(201).json(accionCorrectiva);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al crear la acción correctiva",
      error: error.message,
    });
  }
};

/** Listar todas las acciones correctivas */
export const getAccionesCorrectivas = async (_req: Request, res: Response) => {
  try {
    const accionesCorrectivas = await AccionCorrectiva.findAll({
      order: [["creadoEn", "DESC"]],
    });
    return res.json(accionesCorrectivas);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener acciones correctivas",
      error: error.message,
    });
  }
};

/** Obtener acción correctiva por ID */
export const getAccionCorrectivaById = async (req: Request, res: Response) => {
  try {
    const accionCorrectiva = await AccionCorrectiva.findByPk(req.params.id);
    if (!accionCorrectiva) {
      return res.status(404).json({
        message: "Acción correctiva no encontrada",
      });
    }
    return res.json(accionCorrectiva);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener la acción correctiva",
      error: error.message,
    });
  }
};

/** Actualizar acción correctiva por ID */
export const updateAccionCorrectiva = async (req: Request, res: Response) => {
  try {
    const {
      noConformidadId,
      codigo,
      tipo,
      descripcion,
      analisisCausaRaiz,
      planAccion,
      responsableId,
      fechaCompromiso,
      fechaImplementacion,
      estado,
      eficaciaVerificada,
      verificadoPor,
      fechaVerificacion,
      observacion,
    } = req.body;

    const accionCorrectiva = await AccionCorrectiva.findByPk(req.params.id);
    if (!accionCorrectiva) {
      return res.status(404).json({
        message: "Acción correctiva no encontrada",
      });
    }

    if (codigo && codigo !== accionCorrectiva.codigo) {
      const codigoExiste = await AccionCorrectiva.findOne({
        where: { codigo },
      });
      if (codigoExiste) {
        return res.status(409).json({
          message: "Ya existe una acción correctiva con ese código.",
        });
      }
    }

    await accionCorrectiva.update({
      noConformidadId,
      codigo,
      tipo,
      descripcion,
      analisisCausaRaiz,
      planAccion,
      responsableId,
      fechaCompromiso,
      fechaImplementacion,
      estado,
      eficaciaVerificada,
      verificadoPor,
      fechaVerificacion,
      observacion,
    });

    return res.json(accionCorrectiva);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al actualizar la acción correctiva",
      error: error.message,
    });
  }
};
