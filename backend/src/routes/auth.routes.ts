import { Router } from "express";
// import { AuthController } from '../controllers/auth.controller';
// import { validateAuth } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

// Rutas de autenticación
router.post("/login", authController.login);
router.post("/register", authController.register);
// router.post('/logout', validateAuth, authController.logout);
// router.get('/profile', validateAuth, authController.getProfile);
// router.put('/profile', validateAuth, authController.updateProfile);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
