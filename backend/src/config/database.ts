// src/config/database.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { URL } from "url";

dotenv.config();

// Determinar el ambiente de trabajo
const NODE_ENV = process.env.NODE_ENV || "development";
const USE_CLOUD = process.env.USE_CLOUD === "true";

let sequelize: Sequelize;

// 🌐 Configuración para la nube (Supabase)
if (USE_CLOUD || NODE_ENV === "production") {
  const DATABASE_URL_CLOUD = process.env.DATABASE_URL_CLOUD;

  if (!DATABASE_URL_CLOUD) {
    throw new Error(
      "❌ DATABASE_URL_CLOUD no está definida en las variables de entorno",
    );
  }

  // Parsear la URL manualmente para extraer los componentes
  const dbUrl = new URL(DATABASE_URL_CLOUD);

  sequelize = new Sequelize({
    database: dbUrl.pathname.slice(1), // Remover el "/" inicial
    username: dbUrl.username,
    password: dbUrl.password,
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port),
    dialect: "postgres",
    logging: NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // necesario para Supabase
      },
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  });

  console.log("✅ Conectado a Supabase (nube)");
  console.log(`🌍 Ambiente: ${NODE_ENV}`);
  console.log(`🔗 Host: ${dbUrl.hostname}:${dbUrl.port}`);
} else {
  // 💻 Configuración para base de datos local
  const DB_NAME = process.env.DB_NAME || "calidad";
  const DB_USER = process.env.DB_USER || "postgres";
  const DB_PASSWORD = process.env.DB_PASSWORD || "admin123";
  const DB_HOST = process.env.DB_HOST || "localhost";
  const DB_PORT = Number(process.env.DB_PORT) || 5432;

  sequelize = new Sequelize({
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  console.log("✅ Conectado a base de datos local");
  console.log(`💻 Host: ${DB_HOST}:${DB_PORT}`);
  console.log(`📊 Base de datos: ${DB_NAME}`);
}

// Función para verificar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos verificada exitosamente");
    return true;
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    return false;
  }
};

export default sequelize;
