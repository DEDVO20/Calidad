import { publicDecrypt } from "node:crypto";
import { AssociationError, DataTypes, Model, Optional, Sequelize } from "sequelize";

interface UsuarioAttributes {
  id: string;
  documento: number;
  nombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  correoElectronico: string;
  nombreUsuario: string;
  contraseñaHash: string;
  areaId: string;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, "id" | "activo" | "creadoEn" | "actualizadoEn"> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public id!: string;
  public documento!: number;
  public nombre!: string;
  public segundoNombre?: string;
  public primerApellido!: string;
  public segundoApellido?: string;
  public correoElectronico!: string;
  public nombreUsuario!: string;
  public contraseñaHash!: string;
  public areaId!: string;
  public activo!: boolean;
  public readonly creadoEn!: Date;
  public readonly actualizadoEn!: Date;
}

public static initModel(sequelize: Sequelize): typeof Usuario {
  return Usuario.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes,
        primaryKey: true
      },
      documento: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      segundoNombre: {
        type: DataTypes.STRING,
        allowNull: true
      },
      primerApellido: {
        type: DataTypes.STRING,
        allowNull: false
      },
      segundoApellido: {
        type: DataTypes.STRING,
        allowNull: true
      },
      correoElectronico: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nombreUsuario: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contraseñaHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      areaId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      creadoEn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      actualizadoEn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'usuarios',
      timestamps: false,
      underscored: true,
    }
  );
}
public static associate(models: any): void {
  Usuario.belongsTo(models.Area, { foreignKey: 'areaId', as: 'area' });
  Usuario.hasMany(models.Proceso, { foreignKey: 'creadoPor', as:'procesosCreados' });
  Usuario.hasMany(models.NoConformidad, { foreignKey: 'detectadoPor', as:'noConformidadesDetectadas' });
  Usuario.hasMany(models.Auditoria, { foreignKey: 'creadoPor', as:'auditoriasCreadas' });
}