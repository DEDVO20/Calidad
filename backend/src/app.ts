import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { config } from "./config/env";
import { swaggerSpec } from "./config/swagger";

// Importar rutas
import authRoutes from "./routes/auth.routes";
import areaRoutes from "./routes/area.routes";
import notificacionRoutes from "./routes/notificacion.routes";
import configuracionRoutes from "./routes/configuracion.routes";
import documentoRoutes from "./routes/documento.routes";
import rolRoutes from "./routes/rol.routes";
import rolPermisoRoutes from "./routes/rolPermiso.routes";
import usuarioRoutes from "./routes/usuario.routes";

const app: Application = express();

// Middlewares
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

// Archivos estáticos
app.use("/uploads", express.static("uploads"));

// Ruta de verificación de salud
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API en funcionamiento" });
});

// Documentación de API con Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "SGC API Documentation",
  customfavIcon: "/favicon.ico",
}));

// Endpoint para obtener la especificación OpenAPI en JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Registro de rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/configuraciones", configuracionRoutes);
app.use("/api/documentos", documentoRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/roles-permisos", rolPermisoRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Manejador global de errores
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
