import { Router } from 'express';
import {
    crearAuditoria,
    listarAuditorias,
    obtenerAuditoria,
    actualizarAuditoria,
    eliminarAuditoria
} from '../controllers/auditoria.controller';

const router = Router();

// POST - Crear nueva auditoría
router.post('/', crearAuditoria);

// GET - Listar todas las auditorías
router.get('/', listarAuditorias);

// GET - Obtener auditoría por ID
router.get('/:id', obtenerAuditoria);

// PUT - Actualizar auditoría por ID
router.put('/:id', actualizarAuditoria);

// DELETE - Eliminar auditoría por ID
router.delete('/:id', eliminarAuditoria);

export default router;