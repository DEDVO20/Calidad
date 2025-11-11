// db/connection.js o similar
require("dotenv").config();
const { Pool } = require("pg");

const isCloudMode = process.env.USE_CLOUD === "true";

const pool = new Pool(
  isCloudMode
    ? {
        connectionString: process.env.DATABASE_URL_CLOUD,
        ssl: {
          rejectUnauthorized: false, // Necesario para Supabase
        },
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
);

console.log(
  `🔌 Conectado a base de datos: ${isCloudMode ? "SUPABASE (Nube)" : "LOCAL"}`,
);

module.exports = pool;
