import { Router } from "express";
import {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
} from "../controllers/area.controller";

const router = Router();

// POST /api/areas
router.post("/", createArea);

// GET /api/areas
router.get("/", getAreas);

// GET /api/areas/:id
router.get("/:id", getAreaById);

// PUT /api/areas/:id  (también puedes usar PATCH)
router.put("/:id", updateArea);

export default router;
