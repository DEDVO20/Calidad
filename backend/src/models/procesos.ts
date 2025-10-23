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
        },
        creadoEn: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        actualizadoEn: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        // Nuevos campos ISO 9001
        tipoProceso: {
          type: DataTypes.STRING(50),
          allowNull: true,
          validate: {
            isIn: [["estrategico", "operativo", "apoyo"]],
          },
        },
        responsableId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        estado: {
          type: DataTypes.STRING(50),
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
        },
        proximaRevision: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "procesos",
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
