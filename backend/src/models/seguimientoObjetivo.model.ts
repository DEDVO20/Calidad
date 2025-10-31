import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface SeguimientoObjetivoAttributes {
	id: string;
	objetivoId: string;
	periodo?: Date;
	valorAlcanzado?: number;
	porcentajeCumplimiento?: number;
	observaciones?: string;
	registradoPor?: string;
	creadoEn: Date;
}

interface SeguimientoObjetivoCreationAttributes
	extends Optional<
		SeguimientoObjetivoAttributes,
		| "id"
		| "periodo"
		| "valorAlcanzado"
		| "porcentajeCumplimiento"
		| "observaciones"
		| "registradoPor"
		| "creadoEn"
	> {}

class SeguimientoObjetivo
	extends Model<SeguimientoObjetivoAttributes, SeguimientoObjetivoCreationAttributes>
	implements SeguimientoObjetivoAttributes
{
	public id!: string;
	public objetivoId!: string;
	public periodo?: Date;
	public valorAlcanzado?: number;
	public porcentajeCumplimiento?: number;
	public observaciones?: string;
	public registradoPor?: string;
	public readonly creadoEn!: Date;

	public static initModel(sequelize: Sequelize): typeof SeguimientoObjetivo {
		return SeguimientoObjetivo.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				objetivoId: {
					type: DataTypes.UUID,
					allowNull: false,
					field: "objetivo_id",
				},
				periodo: {
					type: DataTypes.DATEONLY,
					allowNull: true,
				},
				valorAlcanzado: {
					type: DataTypes.DECIMAL,
					allowNull: true,
					field: "valor_alcanzado",
				},
				porcentajeCumplimiento: {
					type: DataTypes.DECIMAL,
					allowNull: true,
					field: "porcentaje_cumplimiento",
				},
				observaciones: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				registradoPor: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "registrado_por",
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
				tableName: "seguimiento_objetivos",
				modelName: "seguimientoObjetivo",
				timestamps: false,
				underscored: true,
			},
		);
	}

	public static associate(models: any): void {
		SeguimientoObjetivo.belongsTo(models.ObjetivoCalidad, { foreignKey: "objetivoId", as: "objetivo" });
		SeguimientoObjetivo.belongsTo(models.Usuario, { foreignKey: "registradoPor", as: "registradoPorUsuario" });
	}
}

export default SeguimientoObjetivo;
