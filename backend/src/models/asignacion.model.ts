import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface AsignacionAttributes {
  id: string;
  areaId: string;
  usuarioId: string;
  esPrincipal: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

interface AsignacionCreationAttributes
  extends Optional<
    AsignacionAttributes,
    "id" | "esPrincipal" | "creadoEn" | "actualizadoEn"
  > {}

class Asignacion
  extends Model<AsignacionAttributes, AsignacionCreationAttributes>
  implements AsignacionAttributes
{
  public id!: string;
  public areaId!: string;
  public usuarioId!: string;
  public esPrincipal!: boolean;
  public creadoEn!: Date;
  public actualizadoEn!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof Asignacion {
    return Asignacion.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        areaId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "area_id",
        },
        usuarioId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "usuario_id",
        },
        esPrincipal: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: "es_principal",
        },
        creadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: "creado_en",
        },
        actualizadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: "actualizado_en",
        },
      },
      {
        sequelize,
        modelName: "Asignacion",
        tableName: "asignaciones",
        timestamps: true,
        underscored: true,
        createdAt: "creadoEn",
        updatedAt: "actualizadoEn",
      },
    );
  }

  public static associate(models: any): void {
    Asignacion.belongsTo(models.Area, {
      foreignKey: "areaId",
      as: "area",
    });
    Asignacion.belongsTo(models.Usuario, {
      foreignKey: "usuarioId",
      as: "usuario",
    });
  }
}

export default Asignacion;
