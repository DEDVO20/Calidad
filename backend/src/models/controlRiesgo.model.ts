import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ControlRiesgoAttributes {
	id: string;
	riesgoId: string;
	descripcion?: string;
	tipo?: string;
	responsableId?: string;
	frecuencia?: string;
	efectividad?: string;
	creadoEn: Date;
}

interface ControlRiesgoCreationAttributes
	extends Optional<
		ControlRiesgoAttributes,
		| "id"
		| "descripcion"
		| "tipo"
		| "responsableId"
		| "frecuencia"
		| "efectividad"
		| "creadoEn"
	> {}

class ControlRiesgo
	extends Model<ControlRiesgoAttributes, ControlRiesgoCreationAttributes>
	implements ControlRiesgoAttributes
{
	public id!: string;
	public riesgoId!: string;
	public descripcion?: string;
	public tipo?: string;
	public responsableId?: string;
	public frecuencia?: string;
	public efectividad?: string;
	public readonly creadoEn!: Date;

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
				tipo: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				responsableId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "responsable_id",
				},
				frecuencia: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				efectividad: {
					type: DataTypes.STRING(50),
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
				tableName: "controles_riesgo",
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

