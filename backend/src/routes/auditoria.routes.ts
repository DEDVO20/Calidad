import { Router } from 'express';
import {
    crearAuditoria,
    listarAuditorias,
    obtenerAuditoria,
    actualizarAuditoria,
    eliminarAuditoria
} from '../controllers/auditoria.controller';

const router = Router();

router.post('/', crearAuditoria);

router.get('/', listarAuditorias);

router.get('/:id', obtenerAuditoria);

router.put('/:id', actualizarAuditoria);

router.delete('/:id', eliminarAuditoria);


export default router;
