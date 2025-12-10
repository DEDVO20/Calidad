import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ControlRiesgoAttributes {
	id: string;
	riesgoId: string;
	descripcion?: string;
	tipoControl?: string;
	frecuencia?: string;
	responsableId?: string;
	efectividad?: string;
	activo?: boolean;
	creadoEn: Date;
	actualizadoEn: Date;
}

interface ControlRiesgoCreationAttributes
	extends Optional<
		ControlRiesgoAttributes,
		| "id"
		| "descripcion"
		| "tipoControl"
		| "frecuencia"
		| "responsableId"
		| "efectividad"
		| "activo"
		| "creadoEn"
		| "actualizadoEn"
	> { }

class ControlRiesgo
	extends Model<ControlRiesgoAttributes, ControlRiesgoCreationAttributes>
	implements ControlRiesgoAttributes {
	public id!: string;
	public riesgoId!: string;
	public descripcion?: string;
	public tipoControl?: string;
	public frecuencia?: string;
	public responsableId?: string;
	public efectividad?: string;
	public activo?: boolean;
	public readonly creadoEn!: Date;
	public readonly actualizadoEn!: Date;

	public static initModel(sequelize: Sequelize): typeof ControlRiesgo {
		return ControlRiesgo.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				riesgoId: {
					type: DataTypes.UUID,
					allowNull: false,
					field: "riesgo_id",
				},
				descripcion: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				tipoControl: {
					type: DataTypes.STRING(50),
					allowNull: true,
					field: "tipo_control",
				},
				frecuencia: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				responsableId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "responsable_id",
				},
				efectividad: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				activo: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
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
				tableName: "control_riesgos",
				modelName: "controlRiesgo",
				timestamps: false,
				underscored: true,
			},
		);
	}

	public static associate(models: any): void {
		ControlRiesgo.belongsTo(models.Riesgo, { foreignKey: "riesgoId", as: "riesgo" });
		ControlRiesgo.belongsTo(models.Usuario, { foreignKey: "responsableId", as: "responsable" });
	}
}

export default ControlRiesgo;

