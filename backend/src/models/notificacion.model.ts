import {
    DataTypes,
    Model,
    Optional,
    Sequelize,
} from "sequelize";
import { Json } from "sequelize/types/utils";
import Usuario from "./usuario.model";

interface NotificacionAttributes {
    id: string;
    usuarioId: string;
    tipo: string;
    contenido?: Json;
    entregado: boolean;
    entregadoEn?: Date;
    creadoEn: Date;
}

interface NotificacionCreationAttributes
    extends Optional<
        NotificacionAttributes,
        "id" | "entregado" | "entregadoEn" | "creadoEn"
    > {}

class Notificacion
extends Model<NotificacionAttributes, NotificacionCreationAttributes>
implements NotificacionAttributes
{
public id!: string;
public usuarioId!: string;
public tipo!: string;
public contenido?: Json;
public entregado!: boolean;
public readonly entregadoEn?: Date;
public readonly creadoEn!: Date;

public static initModel(sequelize: Sequelize): typeof Notificacion {
    return Notificacion.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        usuarioId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'usuario_id',
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
        entregadoEn: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'entregado_en',
        },
        creadoEn: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'creado_en',
        },
        },
        {
            sequelize,
            tableName: "notificaciones",
            timestamps: false,
            underscored: true,
        },
        );
    }

    public static associate(models: any): void {
        Notificacion.belongsTo(models.Usuario, { foreignKey: "usuarioId", as: "usuario" }); 
    }
}

export default Notificacion;


