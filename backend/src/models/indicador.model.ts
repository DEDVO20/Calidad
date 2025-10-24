import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface IndicadorAttributes {
	id: string;
	procesoId?: string;
	clave: string;
	descripcion?: string;
	valor?: number;
	periodoInicio?: Date;
	periodoFin?: Date;
	creadoEn: Date;
}

interface IndicadorCreationAttributes
	extends Optional<IndicadorAttributes, "id" | "procesoId" | "descripcion" | "valor" | "periodoInicio" | "periodoFin" | "creadoEn"> {}

class Indicador extends Model<IndicadorAttributes, IndicadorCreationAttributes> implements IndicadorAttributes {
	public id!: string;
	public procesoId?: string;
	public clave!: string;
	public descripcion?: string;
	public valor?: number;
	public periodoInicio?: Date;
	public periodoFin?: Date;
	public readonly creadoEn!: Date;

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
				clave: {
					type: DataTypes.STRING(200),
					allowNull: false,
				},
				descripcion: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				valor: {
					type: DataTypes.DECIMAL,
					allowNull: true,
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
				creadoEn: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: DataTypes.NOW,
					field: "creado_en",
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
	}
}

export default Indicador;
