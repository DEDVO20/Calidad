import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface IndicadorAttributes {
	id: string;
	procesoId?: string;
	descripcion?: string;
	creadoEn: Date;
}

interface IndicadorCreationAttributes
	extends Optional<IndicadorAttributes, "id" | "procesoId" | "descripcion" | "creadoEn"> { }

class Indicador extends Model<IndicadorAttributes, IndicadorCreationAttributes> implements IndicadorAttributes {
	public id!: string;
	public procesoId?: string;
	public descripcion?: string;
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
				descripcion: {
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
