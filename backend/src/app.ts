import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { config } from "./config/env";
import areaRoutes from "./routes/area.routes";
import accionCorrectivaRoutes from "./routes/accionCorrectiva.routes"; // 👈 Importa tu nueva ruta
import accionProcesoRoutes from "./routes/accionProceso.routes";
import etapaProcesoRoutes from "./routes/etapaProceso.routes";
import instanciaProcesoRoutes from "./routes/instanciaProceso.routes";
import procesoRoutes from "./routes/proceso.routes";
import documentoProcesoRoutes from "./routes/documentoProceso.routes";
import objetivoCalidadRoutes from "./routes/objetivoCalidad.routes";
import seguimientoObjetivoRoutes from "./routes/seguimientoObjetivo.routes";
import indicadorRoutes from "./routes/indicador.routes";
import campoFormularioRoutes from "./routes/campoFormulario.routes";

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

// 📌 Aquí registramos las rutas
app.use("/api/areas", areaRoutes);
app.use("/api/acciones-correctivas", accionCorrectivaRoutes);
app.use("/api/acciones-proceso", accionProcesoRoutes);
app.use("/api/etapas-proceso", etapaProcesoRoutes);
app.use("/api/instancias-proceso", instanciaProcesoRoutes);
app.use("/api/procesos", procesoRoutes);
app.use("/api/documentos-proceso", documentoProcesoRoutes);
app.use("/api/objetivos-calidad", objetivoCalidadRoutes);
app.use("/api/seguimientos-objetivo", seguimientoObjetivoRoutes);
app.use("/api/indicadores", indicadorRoutes);
app.use("/api/campos-formulario", campoFormularioRoutes); // 👈 Nueva ruta de áreas
// Registro de rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/configuraciones", configuracionRoutes);
app.use("/api/documentos", documentoRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/roles-permisos", rolPermisoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auditoria", auditoriaRoutes);
app.use("/api/auditorias", auditoriasRoutes);
app.use("/api/hallazgos-auditoria", hallazgoAuditoriaRoutes);
app.use("/api/controles-riesgo", controlRiesgoRoutes);
app.use("/api/riesgos", riesgoRoutes);

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
