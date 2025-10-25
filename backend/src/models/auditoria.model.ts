import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Json } from "sequelize/types/utils";

interface AuditoriaAttributes {
	id: string;
	usuarioId?: string;
	tipoEntidad?: string;
	entidadId?: string;
	accion?: string;
	detalles?: Json;
	creadoEn: Date;
}

interface AuditoriaCreationAttributes
	extends Optional<
		AuditoriaAttributes,
		| "id"
		| "usuarioId"
		| "tipoEntidad"
		| "entidadId"
		| "accion"
		| "detalles"
		| "creadoEn"
	> {}

class Auditoria
	extends Model<AuditoriaAttributes, AuditoriaCreationAttributes>
	implements AuditoriaAttributes
{
	public id!: string;
	public usuarioId?: string;
	public tipoEntidad?: string;
	public entidadId?: string;
	public accion?: string;
	public detalles?: Json;
	public readonly creadoEn!: Date;

	public static initModel(sequelize: Sequelize): typeof Auditoria {
		return Auditoria.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				usuarioId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "usuario_id",
				},
				tipoEntidad: {
					type: DataTypes.STRING(100),
					allowNull: true,
					field: "tipo_entidad",
				},
				entidadId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "entidad_id",
				},
				accion: {
					type: DataTypes.STRING(100),
					allowNull: true,
				},
				detalles: {
					type: DataTypes.JSON,
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
				tableName: "auditoria",
				modelName: "auditoria",
				timestamps: false,
				underscored: true,
				indexes: [
					{
						name: "idx_auditoria_entidad",
						fields: ["tipo_entidad", "entidad_id"],
					},
				],
			},
		);
	}

	public static associate(models: any): void {
		Auditoria.belongsTo(models.Usuario, { foreignKey: "usuarioId", as: "usuario" });
	}
}

export default Auditoria;

