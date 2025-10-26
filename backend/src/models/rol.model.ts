import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface rolAttributes {
  id: string;
  nombre: string;
  clave: string;
  descripcion?: string;
  creadoEn: Date;
}

interface rolCreationAttributes
  extends Optional<rolAttributes, "id" | "descripcion" | "creadoEn"> {}

class Rol
  extends Model<rolAttributes, rolCreationAttributes>
  implements rolAttributes
{
  id!: string;
  nombre!: string;
  clave!: string;
  descripcion?: string;
  creadoEn!: Date;

  public static initModel(sequelize: Sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        clave: {
          type: DataTypes.STRING(150),
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
        modelName: "rol",
        tableName: "roles",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any) {
    Rol.belongsToMany(models.Usuario, {
      through: models.usuarioRol,
      foreignKey: "rolId",
      otherKey: "usuarioId",
      as: "usuarios",
    });
    Rol.belongsToMany(models.Permiso, {
      through: models.rolPermiso,
      foreignKey: "rolId",
      otherKey: "permisoId",
      as: "permisos",
    });
  }
}

export default Rol;
