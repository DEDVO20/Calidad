import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface IndicadorAttributes {
	id: string;
	procesoId?: string;
	codigo: string;
	nombre: string;
	descripcion?: string;
	tipo?: string;
	formula?: string;
	unidadMedida?: string;
	meta?: number;
	frecuenciaMedicion?: string;
	responsableId?: string;
	estado?: string;
	creadoEn: Date;
	actualizadoEn?: Date;
}

interface IndicadorCreationAttributes
	extends Optional<IndicadorAttributes, "id" | "procesoId" | "descripcion" | "tipo" | "formula" | "unidadMedida" | "meta" | "frecuenciaMedicion" | "responsableId" | "estado" | "creadoEn" | "actualizadoEn"> { }

class Indicador extends Model<IndicadorAttributes, IndicadorCreationAttributes> implements IndicadorAttributes {
	public id!: string;
	public procesoId?: string;
	public codigo!: string;
	public nombre!: string;
	public descripcion?: string;
	public tipo?: string;
	public formula?: string;
	public unidadMedida?: string;
	public meta?: number;
	public frecuenciaMedicion?: string;
	public responsableId?: string;
	public estado?: string;
	public readonly creadoEn!: Date;
	public readonly actualizadoEn?: Date;

	public static initModel(sequelize: Sequelize): typeof Indicador {
		return Indicador.init(
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
				nombre: {
					type: DataTypes.STRING(255),
					allowNull: false,
				},
				descripcion: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				tipo: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				formula: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				unidadMedida: {
					type: DataTypes.STRING(50),
					allowNull: true,
					field: "unidad_medida",
				},
				meta: {
					type: DataTypes.DECIMAL(10, 2),
					allowNull: true,
				},
				frecuenciaMedicion: {
					type: DataTypes.STRING(50),
					allowNull: true,
					field: "frecuencia_medicion",
				},
				responsableId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "responsable_id",
				},
				estado: {
					type: DataTypes.STRING(50),
					allowNull: true,
					defaultValue: "activo",
				},
				creadoEn: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: DataTypes.NOW,
					field: "creado_en",
				},
				actualizadoEn: {
					type: DataTypes.DATE,
					allowNull: true,
					field: "actualizado_en",
				},
			},
			{
				sequelize,
				tableName: "indicadores",
				modelName: "indicador",
				timestamps: false,
				underscored: true,
			},
		);
	}

	public static associate(models: any): void {
		Indicador.belongsTo(models.Proceso, { foreignKey: "procesoId", as: "proceso" });
		Indicador.belongsTo(models.Usuario, { foreignKey: "responsableId", as: "responsable" });
	}
}

export default Indicador;
