import { Router } from "express";
import {
  createParticipante,
  getParticipantes,
  getParticipanteById,
  updateParticipante,
  deleteParticipante,
} from "../controllers/participanteProceso.controller";

const router = Router();

// POST /api/
router.post("/", createParticipante);

// GET /api/
router.get("/", getParticipantes);

// GET /api/:id
router.get("/:id", getParticipanteById);

// PUT /api/:id
router.put("/:id", updateParticipante);

// DELETE /api/:id
router.delete("/:id", deleteParticipante);

export default router;
