import { Sequelize } from "sequelize";
import { config } from "../config/env";

// Importar modelos
import Usuario from "../models/usuario.model";
import Area from "../models/area.model";
import Rol from "../models/rol.model";
import Permiso from "../models/permiso.model";
import AccionCorrectiva from "../models/accionCorrectiva.model";
import Asignacion from "../models/asignacion.model";

// Crear instancia de Sequelize
const sequelize = new Sequelize({
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  host: config.database.host,
  port: config.database.port,
  dialect: "postgres",
  logging: config.nodeEnv === "development" ? console.log : false,
  dialectOptions: config.database.ssl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

// Función para inicializar todos los modelos
const initModels = () => {
  // Inicializar modelos
  Usuario.initModel(sequelize);
  Area.initModel(sequelize);
  Rol.initModel(sequelize);
  Permiso.initModel(sequelize);
  AccionCorrectiva.initModel(sequelize);
  Asignacion.initModel(sequelize);

  // Solo configurar asociaciones básicas que existen
  // Usuario <-> Area
  Usuario.belongsTo(Area, { foreignKey: "areaId", as: "area" });
  Area.hasMany(Usuario, { foreignKey: "areaId", as: "usuarios" });

  // Asignacion <-> Area
  Asignacion.belongsTo(Area, { foreignKey: "areaId", as: "area" });
  Area.hasMany(Asignacion, { foreignKey: "areaId", as: "asignaciones" });

  // Asignacion <-> Usuario
  Asignacion.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
  Usuario.hasMany(Asignacion, { foreignKey: "usuarioId", as: "asignaciones" });

  // Colección de modelos para exportar
  const models = {
    Usuario,
    Area,
    Rol,
    Permiso,
    Asignacion,
  };

  return models;
};

// Función para conectar a la base de datos
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    if (config.useCloud) {
      console.log("✅ Conexión a Supabase establecida correctamente.");
      console.log(`🌍 Host: ${config.database.host}`);
    } else {
      console.log(
        "✅ Conexión a la base de datos local establecida correctamente.",
      );
      console.log(`💻 Host: ${config.database.host}:${config.database.port}`);
    }
    return true;
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    throw error;
  }
};

// Función para sincronizar modelos (solo para desarrollo)
const syncDatabase = async (force = false) => {
  try {
    if (config.nodeEnv === "development") {
      await sequelize.sync({ force });
      console.log(
        `✅ Base de datos sincronizada ${force ? "(RECREADA)" : ""}.`,
      );
    }
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
    throw error;
  }
};

// Función para cerrar la conexión
const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log("✅ Conexión a la base de datos cerrada correctamente.");
  } catch (error) {
    console.error("❌ Error al cerrar la conexión:", error);
    throw error;
  }
};

// Inicializar modelos
const models = initModels();

export {
  sequelize,
  models,
  connectDatabase,
  syncDatabase,
  closeDatabase,
  Usuario,
  Area,
  Rol,
  Permiso,
  AccionCorrectiva,
  Asignacion,
};

export default sequelize;
