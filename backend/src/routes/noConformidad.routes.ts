import { Router } from "express";
import {
  createNoConformidad,
  getNoConformidades,
  getNoConformidadById,
  updateNoConformidad,
  deleteNoConformidad,
  iniciarTratamientoNoConformidad,
  cerrarNoConformidad
} from "../controllers/noConformidad.controller";

const router = Router();

// POST /api/
router.post("/", createNoConformidad);

// GET /api/
router.get("/", getNoConformidades);

// GET /api/abiertas
router.get("/abiertas", (req, res) => {
  req.query.estado = 'abierta';
  return getNoConformidades(req, res);
});

// GET /api/en-tratamiento
router.get("/en-tratamiento", (req, res) => {
  req.query.estado = 'en_tratamiento';
  return getNoConformidades(req, res);
});

// GET /api/en-analisis
router.get("/en-analisis", (req, res) => {
  req.query.estado = 'en_analisis';
  return getNoConformidades(req, res);
});

// GET /api/cerradas
router.get("/cerradas", (req, res) => {
  req.query.estado = 'cerrada';
  return getNoConformidades(req, res);
});

// GET /api/:id
router.get("/:id", getNoConformidadById);

// PUT /api/:id
router.put("/:id", updateNoConformidad);

// DELETE /api/:id
router.delete("/:id", deleteNoConformidad);

// PATCH /api/:id/iniciar-tratamiento
router.patch("/:id/iniciar-tratamiento", iniciarTratamientoNoConformidad);

// PATCH /api/:id/cerrar
router.patch("/:id/cerrar", cerrarNoConformidad);

export default router;
