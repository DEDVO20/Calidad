import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface NotificacionAttributes {
    id: string;
    usuarioId: string;
    titulo: string;
    mensaje: string;
    tipo: string;
    leida: boolean;
    fechaLectura?: Date;
    referenciaTipo?: string;
    referenciaId?: string;
    creadoEn: Date;
}

interface NotificacionCreationAttributes
    extends Optional<
        NotificacionAttributes,
        "id" | "leida" | "fechaLectura" | "referenciaTipo" | "referenciaId" | "creadoEn"
    > { }

class Notificacion
    extends Model<NotificacionAttributes, NotificacionCreationAttributes>
    implements NotificacionAttributes {
    public id!: string;
    public usuarioId!: string;
    public titulo!: string;
    public mensaje!: string;
    public tipo!: string;
    public leida!: boolean;
    public fechaLectura?: Date;
    public referenciaTipo?: string;
    public referenciaId?: string;
    public readonly creadoEn!: Date;

    public static initModel(sequelize: Sequelize): typeof Notificacion {
        return Notificacion.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                usuarioId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    field: "usuario_id",
                },
                titulo: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                mensaje: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                tipo: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                leida: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                fechaLectura: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    field: "fecha_lectura",
                },
                referenciaTipo: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                    field: "referencia_tipo",
                },
                referenciaId: {
                    type: DataTypes.UUID,
                    allowNull: true,
                    field: "referencia_id",
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
                tableName: "notificaciones",
                modelName: "Notificacion",
                timestamps: false,
                underscored: true,
            }
        );
    }

    public static associate(models: any): void {
        Notificacion.belongsTo(models.Usuario, {
            foreignKey: "usuarioId",
            as: "usuario",
        });
    }
}

export default Notificacion;
