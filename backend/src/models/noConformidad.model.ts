import { Model, DataTypes, Optional, Sequelize } from "sequelize";

interface NoConformidadAttributes {
  id: string;
  codigo: string;
  tipo?: string;
  descripcion?: string;
  origen?: string;
  procesoId?: string;
  areaId?: string;
  detectadoPor?: string;
  responsableId?: string;
  estado?: string;
  gravedad?: string;
  fechaDeteccion?: Date;
  fechaLimite?: Date;
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
    | "origen"
    | "procesoId"
    | "areaId"
    | "detectadoPor"
    | "responsableId"
    | "estado"
    | "gravedad"
    | "fechaDeteccion"
    | "fechaLimite"
    | "fechaCierre"
    | "creadoEn"
    | "actualizadoEn"
  > {}

class NoConformidad
  extends Model<NoConformidadAttributes, NoConformidadCreationAttributes>
  implements NoConformidadAttributes
{
  public id!: string;
  public codigo!: string;
  public tipo?: string;
  public descripcion?: string;
  public origen?: string;
  public procesoId?: string;
  public areaId?: string;
  public detectadoPor?: string;
  public responsableId?: string;
  public estado?: string;
  public gravedad?: string;
  public fechaDeteccion?: Date;
  public fechaLimite?: Date;
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
          allowNull: true,
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        origen: {
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
          type: DataTypes.STRING,
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
        gravedad: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        fechaDeteccion: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "fecha_deteccion",
        },
        fechaLimite: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "fecha_limite",
        },
        fechaCierre: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "fecha_cierre",
        },
        creadoEn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "creado_en",
        },
        actualizadoEn: {
          type: DataTypes.DATEONLY,
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
