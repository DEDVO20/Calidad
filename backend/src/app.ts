import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env";

// 📦 Importar las rutas
import areaRoutes from "./routes/area.routes";
import notificacionRoutes from "./routes/notificacion.routes";

const app: Application = express();

// 🔒 Middlewares de seguridad y configuración
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Archivos estáticos
app.use("/uploads", express.static("uploads"));

// 💓 Ruta de verificación de salud
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Api esta Corriendo" });
});

// 🚀 Registro de rutas principales
app.use("/api/areas", areaRoutes);
app.use("/api/notificaciones", notificacionRoutes);

// ⚠️ Manejador global de errores
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
      ...(config.nodeEnv === "development" && { stack: err.stack }),
    });
  },
);

export default app;
