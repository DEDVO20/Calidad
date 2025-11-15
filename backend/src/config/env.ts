import dotenv from "dotenv";
import { URL } from "url";

dotenv.config();

// Determinar si se usa la nube o local
const USE_CLOUD = process.env.USE_CLOUD === "true";
const DATABASE_URL_CLOUD = process.env.DATABASE_URL_CLOUD;

// Función para parsear la configuración de la base de datos
const getDatabaseConfig = () => {
  if (USE_CLOUD && DATABASE_URL_CLOUD) {
    try {
      const dbUrl = new URL(DATABASE_URL_CLOUD);
      return {
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port),
        name: dbUrl.pathname.slice(1), // Remover el "/" inicial
        user: dbUrl.username,
        password: dbUrl.password,
        ssl: true, // Supabase requiere SSL
      };
    } catch (error) {
      console.error("❌ Error al parsear DATABASE_URL_CLOUD:", error);
      throw new Error("DATABASE_URL_CLOUD tiene un formato inválido");
    }
  } else {
    return {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      name: process.env.DB_NAME || "sgc_iso9001",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ssl: false,
    };
  }
};

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  useCloud: USE_CLOUD,

  database: getDatabaseConfig(),

  jwt: {
    secret: process.env.JWT_SECRET || "secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },

  supabase: {
    url: process.env.SUPABASE_URL || "",
    serviceKey: process.env.SUPABASE_SERVICE_KEY || "",
  },

  // upload: {
  //   maxSize: Number(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  //   path: process.env.UPLOAD_PATH || "./uploads",
  // },

  // email: {
  //   host: process.env.SMTP_HOST || "smtp.gmail.com",
  //   port: Number(process.env.SMTP_PORT) || 587,
  //   user: process.env.SMTP_USER || "",
  //   password: process.env.SMTP_PASSWORD || "",
  //   from: process.env.EMAIL_FROM || "noreply@sgc.com",
  // },
};
