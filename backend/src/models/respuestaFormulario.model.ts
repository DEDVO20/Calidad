import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface RespuestaFormularioAttributes {
    id: string;
    instanciaId: string;
    campoId: string;
    valor?: string;
    creadoEn: Date;
}

interface RespuestaFormularioCreationAttributes
    extends Optional<RespuestaFormularioAttributes, "id" | "valor" | "creadoEn"> {}

class RespuestaFormulario
    extends Model<RespuestaFormularioAttributes, RespuestaFormularioCreationAttributes>
    implements RespuestaFormularioAttributes
{
    public id!: string;
    public instanciaId!: string;
    public campoId!: string;
    public valor?: string;
    public readonly creadoEn!: Date;

    public static initModel(sequelize: Sequelize): typeof RespuestaFormulario {
    return RespuestaFormulario.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        instanciaId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "instancia_id",
        },
        campoId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "campo_id",
        },
        valor: {
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
        tableName: "respuestas_formulario",
        modelName: "respuestaFormulario",
        timestamps: false,
        underscored: true,
    },
);
}

public static associate(models: any): void {
    RespuestaFormulario.belongsTo(models.InstanciaProceso, {
        foreignKey: "instanciaId",
        as: "instancia",
    });
    RespuestaFormulario.belongsTo(models.CampoFormulario, {
        foreignKey: "campoId",
        as: "campo",
    });
}
}

export default RespuestaFormulario;
