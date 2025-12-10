import { Router } from "express";
import {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
} from "../controllers/area.controller";

const router = Router();

// POST /api/
router.post("/", createArea);

// GET /api/
router.get("/", getAreas);

// GET /api/:id
router.get("/:id", getAreaById);

// PUT /api/:id
router.put("/:id", updateArea);

export default router;
