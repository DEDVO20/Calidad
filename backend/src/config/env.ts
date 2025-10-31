import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || "sgc_iso9001",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  },

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
