// scripts/testConection.js
require("dotenv").config();
const { Sequelize } = require("sequelize");
const { URL } = require("url");

const USE_CLOUD = process.env.USE_CLOUD === "true";
const NODE_ENV = process.env.NODE_ENV || "development";

console.log("\n🔍 PRUEBA DE CONEXIÓN A LA BASE DE DATOS\n");
console.log("=".repeat(60));

async function testConnection() {
  let sequelize;

  try {
    // 🌐 Configuración para la nube (Supabase)
    if (USE_CLOUD) {
      const DATABASE_URL_CLOUD = process.env.DATABASE_URL_CLOUD;

      if (!DATABASE_URL_CLOUD) {
        throw new Error(
          "❌ DATABASE_URL_CLOUD no está definida en las variables de entorno",
        );
      }

      console.log("\n📡 Conectando a Supabase...");

      // Parsear la URL manualmente
      const dbUrl = new URL(DATABASE_URL_CLOUD);

      console.log(`   Host: ${dbUrl.hostname}`);
      console.log(`   Puerto: ${dbUrl.port}`);
      console.log(`   Base de datos: ${dbUrl.pathname.slice(1)}`);
      console.log(`   Usuario: ${dbUrl.username}`);
      console.log(`   Contraseña: ${"*".repeat(dbUrl.password.length)}`);

      sequelize = new Sequelize({
        database: dbUrl.pathname.slice(1),
        username: dbUrl.username,
        password: dbUrl.password,
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port),
        dialect: "postgres",
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });
    } else {
      // 💻 Configuración para base de datos local
      const DB_NAME = process.env.DB_NAME || "calidad";
      const DB_USER = process.env.DB_USER || "postgres";
      const DB_PASSWORD = process.env.DB_PASSWORD || "admin123";
      const DB_HOST = process.env.DB_HOST || "localhost";
      const DB_PORT = Number(process.env.DB_PORT) || 5432;

      console.log("\n💻 Conectando a base de datos local...");
      console.log(`   Host: ${DB_HOST}`);
      console.log(`   Puerto: ${DB_PORT}`);
      console.log(`   Base de datos: ${DB_NAME}`);
      console.log(`   Usuario: ${DB_USER}`);

      sequelize = new Sequelize({
        database: DB_NAME,
        username: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
        dialect: "postgres",
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });
    }

    // Intentar autenticación
    console.log("\n🔄 Intentando conectar...\n");
    await sequelize.authenticate();

    console.log("✅ CONEXIÓN EXITOSA");
    console.log("\n📊 Probando consulta...");

    // Probar una consulta simple
    const [results] = await sequelize.query(
      "SELECT NOW() as current_time, version() as pg_version",
    );

    console.log("\n✅ CONSULTA EXITOSA");
    console.log(`   Hora del servidor: ${results[0].current_time}`);
    console.log(
      `   Versión PostgreSQL: ${results[0].pg_version.split(" ")[0]} ${results[0].pg_version.split(" ")[1]}`,
    );

    // Probar listado de tablas
    console.log("\n📋 Listando tablas en la base de datos...");
    const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tables.length > 0) {
      console.log(`\n   Total de tablas: ${tables.length}`);
      tables.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.table_name}`);
      });
    } else {
      console.log("   ⚠️  No hay tablas en la base de datos");
      console.log("   💡 Ejecuta las migraciones: npm run db:migrate");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.log("\n" + "=".repeat(60));
    console.error("❌ ERROR DE CONEXIÓN");
    console.log("=".repeat(60));
    console.error("\n📝 Detalles del error:");
    console.error(`   Mensaje: ${error.message}`);

    if (error.original) {
      console.error(`   Error original: ${error.original.message}`);
    }

    console.log("\n💡 Posibles soluciones:");

    if (USE_CLOUD) {
      console.log(
        "   1. Verifica que DATABASE_URL_CLOUD esté correcta en .env",
      );
      console.log(
        "   2. Verifica que la contraseña no tenga caracteres especiales sin codificar",
      );
      console.log("      @ debe ser %40, # debe ser %23, etc.");
      console.log("   3. Verifica que el proyecto en Supabase esté activo");
      console.log("   4. Verifica que tengas acceso de red a Supabase");
      console.log("   5. Intenta resetear la contraseña en Supabase");
    } else {
      console.log(
        "   1. Verifica que PostgreSQL esté corriendo: sudo systemctl status postgresql",
      );
      console.log("   2. Verifica las credenciales en .env");
      console.log(
        "   3. Verifica que la base de datos exista: npm run db:create",
      );
      console.log("   4. Verifica el puerto (por defecto: 5432)");
    }

    console.log("\n🔧 Comandos útiles:");
    console.log("   npm run env:cloud  - Cambiar a Supabase");
    console.log("   npm run env:local  - Cambiar a base de datos local");
    console.log("   node scripts/debug-env.js  - Diagnosticar configuración\n");

    process.exit(1);
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
}

testConnection();
