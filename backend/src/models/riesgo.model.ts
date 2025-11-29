import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface RiesgoAttributes {
	id: string;
	procesoId?: string;
	codigo: string;
	descripcion?: string;
	categoria?: string;
	tipoRiesgo?: string;
	probabilidad?: number;
	impacto?: number;
	nivelRiesgo?: number;
	causas?: string;
	consecuencias?: string;
	responsableId?: string;
	estado?: string;
	creadoEn: Date;
	actualizadoEn: Date;
}

interface RiesgoCreationAttributes
	extends Optional<
		RiesgoAttributes,
		| "id"
		| "procesoId"
		| "descripcion"
		| "categoria"
		| "tipoRiesgo"
		| "probabilidad"
		| "impacto"
		| "nivelRiesgo"
		| "causas"
		| "consecuencias"
		| "responsableId"
		| "estado"
		| "creadoEn"
		| "actualizadoEn"
	> { }

class Riesgo
	extends Model<RiesgoAttributes, RiesgoCreationAttributes>
	implements RiesgoAttributes {
	public id!: string;
	public procesoId?: string;
	public codigo!: string;
	public descripcion?: string;
	public categoria?: string;
	public tipoRiesgo?: string;
	public probabilidad?: number;
	public impacto?: number;
	public nivelRiesgo?: number;
	public causas?: string;
	public consecuencias?: string;
	public responsableId?: string;
	public estado?: string;
	public readonly creadoEn!: Date;
	public readonly actualizadoEn!: Date;

	public static initModel(sequelize: Sequelize): typeof Riesgo {
		return Riesgo.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				procesoId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "proceso_id",
				},
				codigo: {
					type: DataTypes.STRING(50),
					allowNull: false,
					unique: true,
				},
				descripcion: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				categoria: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				tipoRiesgo: {
					type: DataTypes.STRING(50),
					allowNull: true,
					field: "tipo_riesgo",
				},
				probabilidad: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				impacto: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				nivelRiesgo: {
					type: DataTypes.INTEGER,
					allowNull: true,
					field: "nivel_riesgo",
				},
				causas: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				consecuencias: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				responsableId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "responsable_id",
				},
				estado: {
					type: DataTypes.STRING(50),
					allowNull: true,
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
				tableName: "riesgos",
				modelName: "riesgo",
				timestamps: false,
				underscored: true,
			},
		);
	}

	public static associate(models: any): void {
		Riesgo.belongsTo(models.Proceso, { foreignKey: "procesoId", as: "proceso" });
		Riesgo.belongsTo(models.Usuario, { foreignKey: "responsableId", as: "responsable" });
	}
}

export default Riesgo;

