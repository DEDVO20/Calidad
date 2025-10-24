import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ConfiguracionAttributes {
	clave: string;
	valor: object;
	descripcion?: string;
	actualizadoEn: Date;
}

interface ConfiguracionCreationAttributes
	extends Optional<ConfiguracionAttributes, "descripcion" | "actualizadoEn"> {}

class Configuracion
	extends Model<ConfiguracionAttributes, ConfiguracionCreationAttributes>
	implements ConfiguracionAttributes
{
	public clave!: string;
	public valor!: object;
	public descripcion?: string;
	public readonly actualizadoEn!: Date;

	public static initModel(sequelize: Sequelize): typeof Configuracion {
		return Configuracion.init(
			{
				clave: {
					type: DataTypes.STRING(200),
					primaryKey: true,
					allowNull: false,
				},
				valor: {
					type: DataTypes.JSON,
					allowNull: false,
				},
				descripcion: {
					type: DataTypes.TEXT,
					allowNull: true,
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
				tableName: "configuraciones",
				modelName: "configuracion",
				timestamps: false,
				underscored: true,
			},
		);
	}

	public static associate(_: any): void {
        
	}
}

export default Configuracion;
