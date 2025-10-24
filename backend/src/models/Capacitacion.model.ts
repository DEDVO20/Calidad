import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface CapacitacionAttributes {
	id: string;
	titulo?: string;
	descripcion?: string;
	tipo?: string;
	instructor?: string;
	duracionHoras?: number;
	fechaProgramada?: Date;
	fechaRealizacion?: Date;
	lugar?: string;
	responsableId?: string;
	estado?: string;
	creadoEn: Date;
}

interface CapacitacionCreationAttributes
	extends Optional<
		CapacitacionAttributes,
		| "id"
		| "descripcion"
		| "tipo"
		| "instructor"
		| "duracionHoras"
		| "fechaProgramada"
		| "fechaRealizacion"
		| "lugar"
		| "responsableId"
		| "estado"
		| "creadoEn"
	> {}

class Capacitacion
	extends Model<CapacitacionAttributes, CapacitacionCreationAttributes>
	implements CapacitacionAttributes
{
	public id!: string;
	public titulo?: string;
	public descripcion?: string;
	public tipo?: string;
	public instructor?: string;
	public duracionHoras?: number;
	public fechaProgramada?: Date;
	public fechaRealizacion?: Date;
	public lugar?: string;
	public responsableId?: string;
	public estado?: string;
	public readonly creadoEn!: Date;

	public static initModel(sequelize: Sequelize): typeof Capacitacion {
		return Capacitacion.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				titulo: {
					type: DataTypes.STRING(300),
					allowNull: true,
				},
				descripcion: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				tipo: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				instructor: {
					type: DataTypes.STRING(200),
					allowNull: true,
				},
				duracionHoras: {
					type: DataTypes.DECIMAL,
					allowNull: true,
					field: "duracion_horas",
				},
				fechaProgramada: {
					type: DataTypes.DATEONLY,
					allowNull: true,
					field: "fecha_programada",
				},
				fechaRealizacion: {
					type: DataTypes.DATEONLY,
					allowNull: true,
					field: "fecha_realizacion",
				},
				lugar: {
					type: DataTypes.STRING(200),
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
			},
			{
				sequelize,
				tableName: "capacitaciones",
				modelName: "capacitacion",
				timestamps: false,
				underscored: true,
			},
		);
	}

	public static associate(models: any): void {
		Capacitacion.belongsTo(models.Usuario, {
			foreignKey: "responsableId",
			as: "responsable",
		});
		Capacitacion.hasMany(models.AsistenciaCapacitacion, {
			foreignKey: "capacitacionId",
			as: "asistencias",
		});
	}
}

export default Capacitacion;

