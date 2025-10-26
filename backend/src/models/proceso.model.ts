import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ProcesoAttributes {
  id: string;
  codigo: string;
  nombre: string;
  areaId?: string;
  objetivo?: string;
  alcance?: string;
  etapaPhva?: string;
  restringido: boolean;
  creadoPor?: string;
  creadoEn?: Date;
  actualizadoEn?: Date;
  tipoProceso?: string;
  responsableId?: string;
  estado: string;
  version?: string;
  fechaAprobacion?: Date;
  proximaRevision?: Date;
}

interface ProcesoCreationAttributes
  extends Optional<
    ProcesoAttributes,
    "id" | "restringido" | "estado" | "creadoEn" | "actualizadoEn"
  > {}

class Proceso
  extends Model<ProcesoAttributes, ProcesoCreationAttributes>
  implements ProcesoAttributes
{
  public id!: string;
  public codigo!: string;
  public nombre!: string;
  public areaId?: string;
  public objetivo?: string;
  public alcance?: string;
  public etapaPhva?: string;
  public restringido!: boolean;
  public creadoPor?: string;
  public readonly creadoEn!: Date;
  public readonly actualizadoEn!: Date;
  // Nuevos campos
  public tipoProceso?: string;
  public responsableId?: string;
  public estado!: string;
  public version?: string;
  public fechaAprobacion?: Date;
  public proximaRevision?: Date;

  public static initModel(sequelize: Sequelize): typeof Proceso {
    return Proceso.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        codigo: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        nombre: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        areaId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "area_id",
        },
        objetivo: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        alcance: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        etapaPhva: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: "etapa_phva",
          validate: {
            isIn: [["planear", "hacer", "verificar", "actuar"]],
          },
        },
        restringido: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        creadoPor: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "creado_por",
        },
        creadoEn: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: "creado_en",
        },
        actualizadoEn: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: "actualizado_en",
        },
        // Nuevos campos ISO 9001
        tipoProceso: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: "tipo_proceso",
          validate: {
            isIn: [["estrategico", "operativo", "apoyo"]],
          },
        },
        responsableId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "responsable_id",
        },
        estado: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: "activo",
          validate: {
            isIn: [["activo", "inactivo", "revision", "obsoleto"]],
          },
        },
        version: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        fechaAprobacion: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "fecha_aprobacion",
        },
        proximaRevision: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "proxima_revision",
        },
      },
      {
        sequelize,
        tableName: "procesos",
        modelName: "Proceso",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any): void {
    Proceso.belongsTo(models.Area, { foreignKey: "areaId", as: "area" });
    Proceso.belongsTo(models.Usuario, {
      foreignKey: "creadoPor",
      as: "creador",
    });
    Proceso.belongsTo(models.Usuario, {
      foreignKey: "responsableId",
      as: "responsable",
    });
    Proceso.hasMany(models.Indicador, {
      foreignKey: "procesoId",
      as: "indicadores",
    });
    Proceso.hasMany(models.EtapaProceso, {
      foreignKey: "procesoId",
      as: "etapas",
    });
    Proceso.hasMany(models.NoConformidad, {
      foreignKey: "procesoId",
      as: "noConformidades",
    });
    Proceso.hasMany(models.Riesgo, { foreignKey: "procesoId", as: "riesgos" });
  }
}

export default Proceso;
