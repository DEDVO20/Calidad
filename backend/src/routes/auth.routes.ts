import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
  verifyToken,
} from "../controllers/auth.controller";

const router = Router();

// GET /api/me
router.get("/me", getMe);

// POST /api/login
router.post("/login", login);

// POST /api/register
router.post("/register", register);

// POST /api/refresh-token
router.post("/refresh-token", refreshToken);

// POST /api/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /api/reset-password
router.post("/reset-password", resetPassword);

// POST /api/logout
router.post("/logout", logout);

// GET /api/verify
router.get("/verify", verifyToken);

export default router;
