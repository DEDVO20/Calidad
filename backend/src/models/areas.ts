import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import Proceso from "./procesos";

interface AreaAttributes {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

interface AreaCreationAttributes
  extends Optional<AreaAttributes, "id" | "creadoEn" | "actualizadoEn"> {}

class Area
  extends Model<AreaAttributes, AreaCreationAttributes>
  implements AreaAttributes
{
  public id!: string;
  public codigo!: string;
  public nombre!: string;
  public descripcion?: string;
  public creadoEn!: Date;
  public actualizadoEn!: Date;

  public static initModel(sequelize: Sequelize): typeof Area {
    return Area.init(
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
        nombre: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        },
      },
      {
        sequelize,
        tableName: "areas",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any): void {
    Area.hasMany(models.usuarios, { foreignKey: "areaId", as: "usuarios" });
    Area.hasMany(models.procesos, { foreignKey: "areaId", as: "procesos" });
  }
}

export default Area;
