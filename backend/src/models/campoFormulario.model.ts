import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface CampoFormularioAttributes {
    id: string;
    procesoId: string;
    nombre: string;
    claveCampo: string;
    tipoCampo: string;
    obligatorio: boolean;
    orden: number;
    configuracion?: object;
}

interface CampoFormularioCreationAttributes
    extends Optional<
        CampoFormularioAttributes,
            "id" | "configuracion" | "obligatorio" | "orden"
        > {}

class CampoFormulario
    extends Model<CampoFormularioAttributes, CampoFormularioCreationAttributes>
    implements CampoFormularioAttributes
{
    public id!: string;
    public procesoId!: string;
    public nombre!: string;
    public claveCampo!: string;
    public tipoCampo!: string;
    public obligatorio!: boolean;
    public orden!: number;
    public configuracion?: object;

    public static initModel(sequelize: Sequelize): typeof CampoFormulario {
    return CampoFormulario.init(
{
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        procesoId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "proceso_id",
        },
        nombre: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        claveCampo: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: "clave_campo",
        },
        tipoCampo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "tipo_campo",
        },
        obligatorio: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        orden: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0,
        },
        configuracion: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "campos_formulario",
        modelName: "campoFormulario",
        timestamps: false,
        underscored: true,
    },
);
}

public static associate(models: any): void {
    CampoFormulario.belongsTo(models.Proceso, { foreignKey: "procesoId", as: "proceso" });
    CampoFormulario.hasMany(models.RespuestaFormulario, {
        foreignKey: "campoId",
        as: "respuestas",
    });
}
}

export default CampoFormulario;
