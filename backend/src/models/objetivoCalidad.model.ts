import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ObjetivoCalidadAttributes {
	id: string;
	codigo: string;
	descripcion?: string;
	procesoId?: string;
	areaId?: string;
	responsableId?: string;
	meta?: string;
	indicadorId?: string;
	valorMeta?: number;
	periodoInicio?: Date;
	periodoFin?: Date;
	estado?: string;
	creadoEn: Date;
}

interface ObjetivoCalidadCreationAttributes
	extends Optional<
		ObjetivoCalidadAttributes,
		| "id"
		| "descripcion"
		| "procesoId"
		| "areaId"
		| "responsableId"
		| "meta"
		| "indicadorId"
		| "valorMeta"
		| "periodoInicio"
		| "periodoFin"
		| "estado"
		| "creadoEn"
	> {}

class ObjetivoCalidad
	extends Model<ObjetivoCalidadAttributes, ObjetivoCalidadCreationAttributes>
	implements ObjetivoCalidadAttributes
{
	public id!: string;
	public codigo!: string;
	public descripcion?: string;
	public procesoId?: string;
	public areaId?: string;
	public responsableId?: string;
	public meta?: string;
	public indicadorId?: string;
	public valorMeta?: number;
	public periodoInicio?: Date;
	public periodoFin?: Date;
	public estado?: string;
	public readonly creadoEn!: Date;

	public static initModel(sequelize: Sequelize): typeof ObjetivoCalidad {
		return ObjetivoCalidad.init(
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
				responsableId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "responsable_id",
				},
				meta: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				indicadorId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "indicador_id",
				},
				valorMeta: {
					type: DataTypes.DECIMAL,
					allowNull: true,
					field: "valor_meta",
				},
				periodoInicio: {
					type: DataTypes.DATEONLY,
					allowNull: true,
					field: "periodo_inicio",
				},
				periodoFin: {
					type: DataTypes.DATEONLY,
					allowNull: true,
					field: "periodo_fin",
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
			},
			{
				sequelize,
				tableName: "objetivos_calidad",
				modelName: "objetivoCalidad",
				timestamps: false,
				underscored: true,
			},
		);
	}

	public static associate(models: any): void {
		ObjetivoCalidad.belongsTo(models.Proceso, { foreignKey: "procesoId", as: "proceso" });
		ObjetivoCalidad.belongsTo(models.Area, { foreignKey: "areaId", as: "area" });
		ObjetivoCalidad.belongsTo(models.Usuario, { foreignKey: "responsableId", as: "responsable" });
		ObjetivoCalidad.belongsTo(models.Indicador, { foreignKey: "indicadorId", as: "indicador" });
		ObjetivoCalidad.hasMany(models.SeguimientoObjetivo, { foreignKey: "objetivoId", as: "seguimientos" });
	}
}

export default ObjetivoCalidad;
