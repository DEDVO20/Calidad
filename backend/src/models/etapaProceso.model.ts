import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface EtapaProcesoAttributes {
  id: string;
  procesoId: string;
  orden: number;
  nombre: string;
  rolId?: string;
  horasMaximas?: number;
  permiteReapertura?: boolean;
  creadoEn: Date;
}

interface EtapaProcesoCreationAttributes
  extends Optional<
    EtapaProcesoAttributes,
    "id" | "rolId" | "horasMaximas" | "permiteReapertura" | "creadoEn"
  > {}

class EtapaProceso
  extends Model<EtapaProcesoAttributes, EtapaProcesoCreationAttributes>
  implements EtapaProcesoAttributes
{
  public id!: string;
  public nombre!: string;
  public descripcion!: string;
  public procesoId!: string;
  public orden!: number;
  public rolId?: string;
  public horasMaximas?: number;
  public permiteReapertura?: boolean;
  public creadoEn!: Date;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        procesoId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "proceso_id",
        },
        orden: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        nombre: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        rolId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "rol_id",
        },
        horasMaximas: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: "horas_maximas",
        },
        permiteReapertura: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: "permite_reapertura",
        },
        creadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: "creado_en",
        },
      },
      {
        sequelize,
        tableName: "etapa_proceso",
        modelName: "EtapaProceso",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any) {
    EtapaProceso.belongsTo(models.Proceso, {
      foreignKey: "procesoId",
      as: "proceso",
    });
    EtapaProceso.belongsTo(models.Rol, { foreignKey: "rolId", as: "rol" });
    EtapaProceso.hasMany(models.Accionproceso, {
      foreignKey: "etapaId",
      as: "acciones",
    });
  }
}

export default EtapaProceso;
