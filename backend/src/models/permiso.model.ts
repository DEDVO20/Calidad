import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface PermisoAttributes {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  creadoEn: Date;
}

interface PermisoCreationAttributes
  extends Optional<PermisoAttributes, "id" | "descripcion" | "creadoEn"> {}

class Permiso
  extends Model<PermisoAttributes, PermisoCreationAttributes>
  implements PermisoAttributes
{
  public id!: string;
  public nombre!: string;
  public codigo!: string;
  public descripcion?: string;
  public creadoEn!: Date;

  public static initModel(sequelize: Sequelize): typeof Permiso {
    return Permiso.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        codigo: {
          type: DataTypes.STRING(200),
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
      },
      {
        sequelize,
        tableName: "permisos",
        modelName: "Permiso",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any): void {
    Permiso.belongsToMany(models.Rol, {
      through: models.RolPermiso,
      foreignKey: "permiso_id",
      otherKey: "rol_id",
      as: "roles",
    });
  }
}

export default Permiso;
