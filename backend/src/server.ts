import app from "./app";
import { config } from "./config/env";
import { connectDatabase, syncDatabase } from "./database";

const PORT = config.port;

// Test database connection and initialize models
async function initializeDatabase() {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Sincronizar modelos solo en desarrollo si es necesario
    // Nota: En producción usamos migraciones, no sync
    if (config.nodeEnv === "development") {
      // No usar force: true para evitar perder datos
      // await syncDatabase(false);
      console.log("✅ Modelos inicializados (usando migraciones).");
    }
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    // Inicializar base de datos y modelos
    await initializeDatabase();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log("🚀 ===================================");
      console.log(`📡 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${config.nodeEnv}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
      console.log(`📋 Health Check: http://localhost:${PORT}/health`);
      console.log(`📖 API Docs (Swagger): http://localhost:${PORT}/api-docs`);
      console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
      console.log("🚀 ===================================");
    });

    // Manejo de señales para cerrar gracefully
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

// Función para cerrar el servidor gracefully
async function gracefulShutdown(signal: string) {
  console.log(`\n📡 Señal ${signal} recibida. Cerrando servidor...`);

  try {
    const { closeDatabase } = await import("./database");
    await closeDatabase();
    console.log("✅ Servidor cerrado correctamente.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al cerrar servidor:", error);
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on("uncaughtException", (error) => {
  console.error("❌ Excepción no capturada:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "❌ Promesa rechazada no manejada en:",
    promise,
    "razón:",
    reason,
  );
  process.exit(1);
});

// Iniciar el servidor
startServer();
