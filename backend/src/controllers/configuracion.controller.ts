import { Request, Response } from "express";
import Configuracion from "../models/configuracion.model";

/** Crear configuración (PK: clave) */
export const createConfiguracion = async (req: Request, res: Response) => {
  try {
    const { clave, valor, descripcion } = req.body;

    if (!clave || typeof clave !== "string") {
      return res.status(400).json({ message: "La 'clave' es obligatoria y debe ser string." });
    }
    if (valor === undefined) {
      return res.status(400).json({ message: "El campo 'valor' es obligatorio." });
    }

    const exists = await Configuracion.findByPk(clave);
    if (exists) {
      return res.status(409).json({ message: "Ya existe una configuración con esa clave." });
    }

    const conf = await Configuracion.create({ clave, valor, descripcion });
    return res.status(201).json(conf);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al crear configuración", error: error.message });
  }
};

/** Listar configuraciones */
export const getConfiguraciones = async (_req: Request, res: Response) => {
  try {
    const lista = await Configuracion.findAll({ order: [["actualizadoEn", "DESC"]] });
    return res.json(lista);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al obtener configuraciones", error: error.message });
  }
};

/** Obtener configuración por clave */
export const getConfiguracionByClave = async (req: Request, res: Response) => {
  try {
    const { clave } = req.params;
    const conf = await Configuracion.findByPk(clave);
    if (!conf) return res.status(404).json({ message: "Configuración no encontrada" });
    return res.json(conf);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al obtener configuración", error: error.message });
  }
};

/** Actualizar configuración por clave (no se cambia la PK) */
export const updateConfiguracion = async (req: Request, res: Response) => {
  try {
    const { clave } = req.params;
    const { valor, descripcion } = req.body;

    const conf = await Configuracion.findByPk(clave);
    if (!conf) return res.status(404).json({ message: "Configuración no encontrada" });

    await conf.update({
      valor,
      descripcion,
      actualizadoEn: new Date(),
    });

    return res.json(conf);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al actualizar configuración", error: error.message });
  }
};

/** Eliminar configuración por clave */
export const deleteConfiguracion = async (req: Request, res: Response) => {
  try {
    const { clave } = req.params;
    const rows = await Configuracion.destroy({ where: { clave } });
    if (rows === 0) return res.status(404).json({ message: "Configuración no encontrada" });
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ message: "Error al eliminar configuración", error: error.message });
  }
};
