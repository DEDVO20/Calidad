import app from "./app";
import { config } from "./config/env";
import sequelize from "./config/database";

const PORT = config.port;

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync models (only in development)
    if (config.nodeEnv === "development") {
      await sequelize.sync({ alter: true });
      console.log("✅ Database models synchronized.");
    }
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
  });
}

startServer();
