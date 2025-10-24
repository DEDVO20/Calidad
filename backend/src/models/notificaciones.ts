import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface NotificacionAttributes {
  id: string;
  usuario_id: string;
  tipo: string;
  contenido?: Record<string, any>;
  entregado: boolean;
  entregado_en?: Date;
  creado_en: Date;
}

interface NotificacionCreationAttributes
  extends Optional<
    NotificacionAttributes,
    "id" | "entregado" | "entregado_en" | "creado_en"
  > {}

class Notificacion
  extends Model<NotificacionAttributes, NotificacionCreationAttributes>
  implements NotificacionAttributes
{
  public id!: string;
  public usuario_id!: string;
  public tipo!: string;
  public contenido?: Record<string, any>;
  public entregado!: boolean;
  public entregado_en?: Date;
  public creado_en!: Date;

  static initModel(sequelize: Sequelize): typeof Notificacion {
    return Notificacion.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4, // ✅ correcto
          primaryKey: true,
        },
        usuario_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        tipo: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        contenido: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        entregado: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        entregado_en: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        creado_en: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "notificaciones",
        timestamps: false,   // usamos creado_en manual
        underscored: true,
      }
    );
  }

  static associate(models: any): void {
    Notificacion.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      as: "usuario",
    });
  }
}

export default Notificacion;




