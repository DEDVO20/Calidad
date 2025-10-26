import { Router } from "express";
import {
  createParticipante,
  getParticipantes,
  getParticipanteById,
  updateParticipante,
  deleteParticipante,
} from "../controllers/participanteProceso.controller";

const router = Router();

// POST /api/participantes-proceso
router.post("/", createParticipante);

// GET /api/participantes-proceso
router.get("/", getParticipantes);

// GET /api/participantes-proceso/:id
router.get("/:id", getParticipanteById);

// PUT /api/participantes-proceso/:id
router.put("/:id", updateParticipante);

// DELETE /api/participantes-proceso/:id
router.delete("/:id", deleteParticipante);

export default router;
