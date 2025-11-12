import express from "express";
import app from "../src/app";
import { connectDatabase } from "../src/database";
import { config } from "../src/config/env";

const server = express();

// Asegurar conexión a la base de datos Supabase/Postgres
server.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("❌ Error conectando a la base de datos Supabase:", error);
    res.status(500).json({ error: "Error conectando a la base de datos" });
  }
});

// Usa la app de Express completa
server.use(app);

// Exporta el handler para Vercel
export default server;
