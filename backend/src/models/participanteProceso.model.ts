import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ParticipanteProcesoAttributes {
  id: string;
  instanciaId: string;
  usuarioId: string;
  rol: string;
  creadoEn: Date;
}

interface ParticipanteProcesoCreationAttributes
  extends Optional<ParticipanteProcesoAttributes, "id" | "creadoEn"> {}

class ParticipanteProceso
  extends Model<
    ParticipanteProcesoAttributes,
    ParticipanteProcesoCreationAttributes
  >
  implements ParticipanteProcesoAttributes
{
  public id!: string;
  public instanciaId!: string;
  public usuarioId!: string;
  public rol!: string;
  public creadoEn!: Date;

  public static initModel(sequelize: Sequelize): void {
    ParticipanteProceso.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        instanciaId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "instancia_id",
        },
        usuarioId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "usuario_id",
        },
        rol: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        creadoEn: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: "creado_en",
        },
      },
      {
        sequelize,
        tableName: "participantes_procesos",
        modelName: "ParticipanteProceso",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any): void {
    ParticipanteProceso.belongsTo(models.Instancia, {
      foreignKey: "instanciaId",
      as: "instancia",
    });
    ParticipanteProceso.belongsTo(models.Usuario, {
      foreignKey: "usuarioId",
      as: "usuario",
    });
  }
}

export default ParticipanteProceso;
