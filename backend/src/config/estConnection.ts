// testConnection.ts
import sequelize from "./database"; // ajusta la ruta según tu proyecto

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión exitosa a la base de datos Supabase/PostgreSQL.");
    const [result] = await sequelize.query("SELECT NOW();");
    console.log("🕒 Fecha/hora del servidor:", (result[0] as any).now);
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
  } finally {
    await sequelize.close();
  }
})();
