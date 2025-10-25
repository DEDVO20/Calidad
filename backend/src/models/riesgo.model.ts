import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface RiesgoAttributes {
	id: string;
	codigo: string;
	descripcion?: string;
	tipo?: string;
	procesoId?: string;
	areaId?: string;
	probabilidad?: number;
	impacto?: number;
	nivelRiesgo?: number;
	tratamiento?: string;
	responsableId?: string;
	estado?: string;
	fechaIdentificacion?: Date;
	fechaRevision?: Date;
	creadoEn: Date;
	actualizadoEn: Date;
}

interface RiesgoCreationAttributes
	extends Optional<
		RiesgoAttributes,
		| "id"
		| "descripcion"
		| "tipo"
		| "procesoId"
		| "areaId"
		| "probabilidad"
		| "impacto"
		| "nivelRiesgo"
		| "tratamiento"
		| "responsableId"
		| "estado"
		| "fechaIdentificacion"
		| "fechaRevision"
		| "creadoEn"
		| "actualizadoEn"
	> {}

class Riesgo
	extends Model<RiesgoAttributes, RiesgoCreationAttributes>
	implements RiesgoAttributes
{
	public id!: string;
	public codigo!: string;
	public descripcion?: string;
	public tipo?: string;
	public procesoId?: string;
	public areaId?: string;
	public probabilidad?: number;
	public impacto?: number;
	public nivelRiesgo?: number;
	public tratamiento?: string;
	public responsableId?: string;
	public estado?: string;
	public fechaIdentificacion?: Date;
	public fechaRevision?: Date;
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
				codigo: {
					type: DataTypes.STRING(50),
					allowNull: false,
					unique: true,
				},
				descripcion: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				tipo: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				procesoId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "proceso_id",
				},
				areaId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "area_id",
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
				tratamiento: {
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
				fechaIdentificacion: {
					type: DataTypes.DATEONLY,
					allowNull: true,
					field: "fecha_identificacion",
				},
				fechaRevision: {
					type: DataTypes.DATEONLY,
					allowNull: true,
					field: "fecha_revision",
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
		Riesgo.belongsTo(models.Area, { foreignKey: "areaId", as: "area" });
		Riesgo.belongsTo(models.Usuario, { foreignKey: "responsableId", as: "responsable" });
		Riesgo.hasMany(models.ControlRiesgo, { foreignKey: "riesgoId", as: "controles" });
	}
}

export default Riesgo;

