import { Sequelize } from "sequelize";
import { config } from "../config/env";

// Importar modelos
import Usuario from "../models/usuario.model";
import Area from "../models/area.model";
import Rol from "../models/rol.model";
import Permiso from "../models/permiso.model";
import NoConformidad from "../models/noConformidad.model";
import AccionCorrectiva from "../models/accionCorrectiva.model";
import Asignacion from "../models/asignacion.model";
import Documento from "../models/documento.model";
import VersionDocumento from "../models/versionDocumento.model";
import DocumentoProceso from "../models/documentoProceso.model";
import Auditorias from "../models/auditorias.model";
import Auditoria from "../models/auditoria.model";
import AccionProceso from "../models/accionProceso.model";
import AsistenciaCapacitacion from "../models/asistenciaCapacitacion.model";
import CampoFormulario from "../models/campoFormulario.model";
import Capacitacion from "../models/capacitacion.model";
import Configuracion from "../models/configuracion.model";
import ControlRiesgo from "../models/controlRiesgo.model";
import EtapaProceso from "../models/etapaProceso.model";
import HallazgoAuditoria from "../models/hallazgoAuditoria.model";
import Indicador from "../models/indicador.model";
import InstanciaProceso from "../models/instanciaProceso.model";
import Notificacion from "../models/notificacion.model";
import ObjetivoCalidad from "../models/objetivoCalidad.model";
import ParticipanteProceso from "../models/participanteProceso.model";
import Proceso from "../models/proceso.model";
import RespuestaFormulario from "../models/respuestaFormulario.model";
import Riesgo from "../models/riesgo.model";
import RolPermiso from "../models/rolPermiso.model";
import SeguimientoObjetivo from "../models/seguimientoObjetivo.model";
import Ticket from "../models/tickets.model";
import UsuarioRol from "../models/usuarioRol.model";

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
  NoConformidad.initModel(sequelize);
  AccionCorrectiva.initModel(sequelize);
  Asignacion.initModel(sequelize);
  Auditorias.initModel(sequelize);
  Auditoria.initModel(sequelize);
  Documento.initModel(sequelize);
  VersionDocumento.initModel(sequelize);
  DocumentoProceso.initModel(sequelize);
  AccionProceso.initModel(sequelize);
  AsistenciaCapacitacion.initModel(sequelize);
  CampoFormulario.initModel(sequelize);
  Capacitacion.initModel(sequelize);
  Configuracion.initModel(sequelize);
  ControlRiesgo.initModel(sequelize);
  EtapaProceso.initModel(sequelize);
  HallazgoAuditoria.initModel(sequelize);
  Indicador.initModel(sequelize);
  InstanciaProceso.initModel(sequelize);
  Notificacion.initModel(sequelize);
  ObjetivoCalidad.initModel(sequelize);
  ParticipanteProceso.initModel(sequelize);
  Proceso.initModel(sequelize);
  RespuestaFormulario.initModel(sequelize);
  Riesgo.initModel(sequelize);
  RolPermiso.initModel(sequelize);
  SeguimientoObjetivo.initModel(sequelize);
  Ticket.initModel(sequelize);
  UsuarioRol.initModel(sequelize);

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

  // Configurar asociaciones de Documento
  Documento.belongsTo(Usuario, { foreignKey: "subidoPor", as: "subidor" });
  Documento.belongsTo(Usuario, { foreignKey: "creadoPor", as: "autor" });
  Documento.belongsTo(Usuario, { foreignKey: "revisadoPor", as: "revisor" });
  Documento.belongsTo(Usuario, { foreignKey: "aprobadoPor", as: "aprobador" });
  
  // Documento <-> VersionDocumento
  Documento.hasMany(VersionDocumento, { foreignKey: "documentoId", as: "versiones" });
  VersionDocumento.belongsTo(Documento, { foreignKey: "documentoId", as: "documento" });
  
  // Documento <-> DocumentoProceso
  Documento.hasMany(DocumentoProceso, { foreignKey: "documentoId", as: "procesosRelacionados" });
  DocumentoProceso.belongsTo(Documento, { foreignKey: "documentoId", as: "documento" });

  // NoConformidad <-> Usuario
  NoConformidad.belongsTo(Usuario, { foreignKey: "detectadoPor", as: "detectadoPorUsuario" });
  NoConformidad.belongsTo(Usuario, { foreignKey: "responsableId", as: "responsable" });
  
  // NoConformidad <-> Area
  NoConformidad.belongsTo(Area, { foreignKey: "areaId", as: "area" });
  Area.hasMany(NoConformidad, { foreignKey: "areaId", as: "noConformidades" });
  
  // AccionCorrectiva <-> NoConformidad
  AccionCorrectiva.belongsTo(NoConformidad, { foreignKey: "noConformidadId", as: "noConformidad" });
  NoConformidad.hasMany(AccionCorrectiva, { foreignKey: "noConformidadId", as: "accionesCorrectivas" });

  // Colección de modelos para exportar
  const models = {
    Usuario,
    Area,
    Rol,
    Permiso,
    NoConformidad,
    AccionCorrectiva,
    Asignacion,
    Documento,
    VersionDocumento,
    DocumentoProceso,
    Auditorias,
    Auditoria,
    AccionProceso,
    AsistenciaCapacitacion,
    CampoFormulario,
    Capacitacion,
    Configuracion,
    ControlRiesgo,
    EtapaProceso,
    HallazgoAuditoria,
    Indicador,
    InstanciaProceso,
    Notificacion,
    ObjetivoCalidad,
    ParticipanteProceso,
    Proceso,
    RespuestaFormulario,
    Riesgo,
    RolPermiso,
    SeguimientoObjetivo,
    Ticket,
    UsuarioRol,
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
  NoConformidad,
  AccionCorrectiva,
  Asignacion,
  Documento,
  VersionDocumento,
  DocumentoProceso,
  Auditorias,
  Auditoria,
  AccionProceso,
  AsistenciaCapacitacion,
  CampoFormulario,
  Capacitacion,
  Configuracion,
  ControlRiesgo,
  EtapaProceso,
  HallazgoAuditoria,
  Indicador,
  InstanciaProceso,
  Notificacion,
  ObjetivoCalidad,
  ParticipanteProceso,
  Proceso,
  RespuestaFormulario,
  Riesgo,
  RolPermiso,
  SeguimientoObjetivo,
  Ticket,
  UsuarioRol,
};

export default sequelize;
