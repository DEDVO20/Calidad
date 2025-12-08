import { Model, DataTypes, Optional, Sequelize } from "sequelize";

interface NoConformidadAttributes {
  id: string;
  codigo: string;
  tipo?: string;
  descripcion?: string;
  fuente?: string;
  procesoId?: string;
  areaId?: string;
  detectadoPor?: string;
  responsableId?: string;
  estado?: string;
  fechaDeteccion?: Date;
  analisisCausa?: string;
  planAccion?: string;
  fechaCierre?: Date;
  creadoEn?: Date;
  actualizadoEn?: Date;
}

interface NoConformidadCreationAttributes
  extends Optional<
    NoConformidadAttributes,
    | "id"
    | "tipo"
    | "descripcion"
    | "fuente"
    | "procesoId"
    | "areaId"
    | "detectadoPor"
    | "responsableId"
    | "estado"
    | "fechaDeteccion"
    | "analisisCausa"
    | "planAccion"
    | "fechaCierre"
    | "creadoEn"
    | "actualizadoEn"
  > { }

class NoConformidad
  extends Model<NoConformidadAttributes, NoConformidadCreationAttributes>
  implements NoConformidadAttributes {
  public id!: string;
  public codigo!: string;
  public tipo?: string;
  public descripcion?: string;
  public fuente?: string;
  public procesoId?: string;
  public areaId?: string;
  public detectadoPor?: string;
  public responsableId?: string;
  public estado?: string;
  public fechaDeteccion?: Date;
  public analisisCausa?: string;
  public planAccion?: string;
  public fechaCierre?: Date;
  public creadoEn?: Date;
  public actualizadoEn?: Date;

  public static initModel(sequelize: Sequelize): typeof NoConformidad {
    return NoConformidad.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        codigo: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        tipo: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        fuente: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        procesoId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "proceso_id",
        },
        areaId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "area_id",
        },
        detectadoPor: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "detectado_por",
        },
        responsableId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "responsable_id",
        },
        estado: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        fechaDeteccion: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "fecha_deteccion",
        },
        analisisCausa: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "analisis_causa",
        },
        planAccion: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "plan_accion",
        },
        fechaCierre: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "fecha_cierre",
        },
        creadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: "creado_en",
        },
        actualizadoEn: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: "actualizado_en",
        },
      },
      {
        sequelize,
        modelName: "NoConformidad",
        tableName: "no_conformidades",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any) {
    NoConformidad.belongsTo(models.Proceso, {
      foreignKey: "procesoId",
      as: "proceso",
    });
    NoConformidad.belongsTo(models.Area, { foreignKey: "areaId", as: "area" });
    NoConformidad.belongsTo(models.Usuario, {
      foreignKey: "detectadoPor",
      as: "detectadoPorUsuario",
    });
    NoConformidad.belongsTo(models.Usuario, {
      foreignKey: "responsableId",
      as: "responsable",
    });
    NoConformidad.hasMany(models.AccionCorrectiva, {
      foreignKey: "noConformidadId",
      as: "accionesCorrectivas",
    });
  }
}

export default NoConformidad;
