import { Request, Response } from "express";

export class AuthController {
  /** Simula inicio de sesión */
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
    }

    // Aquí iría la lógica real con tu base de datos o JWT
    return res.status(200).json({ message: "Inicio de sesión exitoso", email });
  }

  /** Simula registro */
  async register(req: Request, res: Response) {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Aquí podrías insertar en DB
    return res.status(201).json({ message: "Usuario registrado correctamente" });
  }

  async refreshToken(req: Request, res: Response) {
    return res.json({ message: "Token renovado" });
  }

  async forgotPassword(req: Request, res: Response) {
    return res.json({ message: "Correo de recuperación enviado" });
  }

  async resetPassword(req: Request, res: Response) {
    return res.json({ message: "Contraseña restablecida" });
  }
}

// 👇 exporta la clase lista para usar
export default new AuthController();
