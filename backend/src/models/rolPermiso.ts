import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface RolPermisoAttributes {
  id: string;
  rolId: string;
  permisoId: string;
}

interface PermisoCreationAttributes
  extends Optional<RolPermisoAttributes, "id"> {}

class RolPermiso
  extends Model<RolPermisoAttributes, PermisoCreationAttributes>
  implements RolPermisoAttributes
{
  public id!: string;
  public rolId!: string;
  public permisoId!: string;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        rolId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "rol_id",
        },
        permisoId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "permiso_id",
        },
      },
      {
        sequelize,
        tableName: "roles_permisos",
        modelName: "RolPermiso",
        timestamps: false,
        underscored: true,
      },
    );
  }
}

export default RolPermiso;
