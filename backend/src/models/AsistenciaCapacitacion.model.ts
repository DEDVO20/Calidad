import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface AsistenciaCapacitacionAttributes {
	id: string;
	capacitacionId: string;
	usuarioId: string;
	asistio?: boolean;
	calificacion?: number;
	aprobado?: boolean;
	observaciones?: string;
	certificadoUrl?: string;
	creadoEn: Date;
}

interface AsistenciaCapacitacionCreationAttributes
	extends Optional<
		AsistenciaCapacitacionAttributes,
		| "id"
		| "asistio"
		| "calificacion"
		| "aprobado"
		| "observaciones"
		| "certificadoUrl"
		| "creadoEn"
	> {}

class AsistenciaCapacitacion
	extends Model<AsistenciaCapacitacionAttributes, AsistenciaCapacitacionCreationAttributes>
	implements AsistenciaCapacitacionAttributes
{
	public id!: string;
	public capacitacionId!: string;
	public usuarioId!: string;
	public asistio?: boolean;
	public calificacion?: number;
	public aprobado?: boolean;
	public observaciones?: string;
	public certificadoUrl?: string;
	public readonly creadoEn!: Date;

	public static initModel(sequelize: Sequelize): typeof AsistenciaCapacitacion {
		return AsistenciaCapacitacion.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				capacitacionId: {
					type: DataTypes.UUID,
					allowNull: false,
					field: "capacitacion_id",
				},
				usuarioId: {
					type: DataTypes.UUID,
					allowNull: false,
					field: "usuario_id",
				},
				asistio: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
				},
				calificacion: {
					type: DataTypes.DECIMAL,
					allowNull: true,
				},
				aprobado: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
				},
				observaciones: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				certificadoUrl: {
					type: DataTypes.TEXT,
					allowNull: true,
					field: "certificado_url",
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
				tableName: "asistencia_capacitaciones",
				modelName: "asistenciaCapacitacion",
				timestamps: false,
				underscored: true,
			},
		);
	}

	public static associate(models: any): void {
		AsistenciaCapacitacion.belongsTo(models.Capacitacion, {
			foreignKey: "capacitacionId",
			as: "capacitacion",
		});
		AsistenciaCapacitacion.belongsTo(models.Usuario, {
			foreignKey: "usuarioId",
			as: "usuario",
		});
	}
}

export default AsistenciaCapacitacion;

