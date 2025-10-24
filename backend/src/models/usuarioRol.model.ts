import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface UsuarioRolAttributes {
  id: string;
  usuarioId: string;
  rolId: string;
  areaId?: string;
  asignadoPor?: string;
  asignadoEn?: Date;
}

interface UsuarioRolCreationAttributes
  extends Optional<
    UsuarioRolAttributes,
    "id" | "areaId" | "asignadoPor" | "asignadoEn"
  > {}

class UsuarioRol
  extends Model<UsuarioRolAttributes, UsuarioRolCreationAttributes>
  implements UsuarioRolAttributes
{
  public id!: string;
  public usuarioId!: string;
  public rolId!: string;
  public areaId?: string;
  public asignadoPor?: string;
  public asignadoEn?: Date;

  public static initModel(sequelize: Sequelize): typeof UsuarioRol {
    return UsuarioRol.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        usuarioId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "usuario_id",
        },
        rolId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "rol_id",
        },
        areaId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "area_id",
        },
        asignadoPor: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "asignado_por",
        },
        asignadoEn: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
          field: "asignado_en",
        },
      },
      {
        sequelize,
        modelName: "UsuarioRol",
        tableName: "usuarios_roles",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any): void {
    UsuarioRol.belongsTo(models.Usuario, {
      foreignKey: "usuarioId",
      as: "usuario",
    });
    UsuarioRol.belongsTo(models.Rol, { foreignKey: "rolId", as: "rol" });
  }
}

export default UsuarioRol;
