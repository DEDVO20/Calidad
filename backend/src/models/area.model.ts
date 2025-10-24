import { DataTypes, Model, Optional, Sequelize } from "sequelize";

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

  static initModel(sequelize: Sequelize): typeof Area {
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
          field: "actualizado_en",
        },
      },
      {
        sequelize,
        tableName: "areas",
        timestamps: false, // usamos campos manuales
        underscored: true,
      }
    );
  }

  static associate(models: any): void {
    // Ajusta los nombres según existan en tu proyecto:
    Area.hasMany(models.Usuario, { foreignKey: "areaId", as: "usuarios" });
    Area.hasMany(models.Proceso, { foreignKey: "areaId", as: "procesos" });
  }
}

export default Area;
