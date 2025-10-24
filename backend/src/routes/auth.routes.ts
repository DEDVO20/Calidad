import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  verifyToken,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/verify", verifyToken);

export default router;
