import { Request, Response } from 'express';
import AuditoriaModel from '../models/auditoria.model';

// Crear
export const crearAuditoria = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ mensaje: "El cuerpo de la solicitud está vacío" });
    }

    const nuevo = await AuditoriaModel.create(payload);
    return res.status(201).json(nuevo);
  } catch (error) {
    console.error('crearAuditoria:', error);
    return res.status(500).json({ mensaje: 'Error al crear auditoría' });
  }
};


// Listar todas
export const listarAuditorias = async (req: Request, res: Response) => {
  try {
    const auditorias = await AuditoriaModel.findAll();
    return res.status(200).json(auditorias);
  } catch (error) {
    console.error('listarAuditorias:', error);
    return res.status(500).json({ mensaje: 'Error al obtener auditorías' });
  }
};

// Obtener una por ID
export const obtenerAuditoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const registro = await AuditoriaModel.findByPk(id);
    if (!registro) return res.status(404).json({ mensaje: 'Auditoría no encontrada' });
    return res.status(200).json(registro);
  } catch (error) {
    console.error('obtenerAuditoria:', error);
    return res.status(500).json({ mensaje: 'Error al obtener auditoría' });
  }
};

// Actualizar
export const actualizarAuditoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const registro = await AuditoriaModel.findByPk(id);
    if (!registro) return res.status(404).json({ mensaje: 'Auditoría no encontrada' });

    await registro.update(cambios);
    return res.status(200).json(registro);
  } catch (error) {
    console.error('actualizarAuditoria:', error);
    return res.status(500).json({ mensaje: 'Error al actualizar auditoría' });
  }
};

// Eliminar
export const eliminarAuditoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const registro = await AuditoriaModel.findByPk(id);
    if (!registro) return res.status(404).json({ mensaje: 'Auditoría no encontrada' });

    await registro.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('eliminarAuditoria:', error);
    return res.status(500).json({ mensaje: 'Error al eliminar auditoría' });
  }
};
