import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface UsuarioAttributes {
  id: string;
  documento: number;
  nombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  correoElectronico: string;
  nombreUsuario: string;
  contrasenaHash: string;
  areaId: string;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

interface UsuarioCreationAttributes
  extends Optional<
    UsuarioAttributes,
    | "id"
    | "segundoNombre"
    | "segundoApellido"
    | "areaId"
    | "activo"
    | "creadoEn"
    | "actualizadoEn"
  > {}

class Usuario
  extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes
{
  public id!: string;
  public documento!: number;
  public nombre!: string;
  public segundoNombre?: string;
  public primerApellido!: string;
  public segundoApellido?: string;
  public correoElectronico!: string;
  public nombreUsuario!: string;
  public contrasenaHash!: string;
  public areaId!: string;
  public activo!: boolean;
  public readonly creadoEn!: Date;
  public readonly actualizadoEn!: Date;

  public static initModel(sequelize: Sequelize): typeof Usuario {
    return Usuario.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        documento: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
        },
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        segundoNombre: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: "segundo_nombre",
        },
        primerApellido: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: "primer_apellido",
        },
        segundoApellido: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: "segundo_apellido",
        },
        correoElectronico: {
          type: DataTypes.STRING(254),
          allowNull: false,
          field: "correo_electronico",
        },
        nombreUsuario: {
          type: DataTypes.STRING(150),
          allowNull: false,
          field: "nombre_usuario",
          unique: true,
        },
        contrasenaHash: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "contrasena_hash",
        },
        areaId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "area_id",
        },
        activo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
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
        tableName: "usuarios",
        modelName: "usuario",
        timestamps: false,
        underscored: true,
      },
    );
  }
  public static associate(models: any): void {
    Usuario.belongsTo(models.Area, { foreignKey: "areaId", as: "area" });
    Usuario.hasMany(models.Proceso, {
      foreignKey: "creadoPor",
      as: "procesosCreados",
    });
    Usuario.hasMany(models.NoConformidad, {
      foreignKey: "detectadoPor",
      as: "noConformidadesDetectadas",
    });
    Usuario.hasMany(models.Auditoria, {
      foreignKey: "creadoPor",
      as: "auditoriasCreadas",
    });
  }
}

export default Usuario;
