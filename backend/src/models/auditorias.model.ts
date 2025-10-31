
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface AuditoriasAttributes {
	id: string;
	codigo: string;
	tipo?: string;
	objetivo?: string;
	alcance?: string;
	normaReferencia?: string;
	auditorLiderId?: string;
	fechaPlanificada?: Date;
	fechaInicio?: Date;
	fechaFin?: Date;
	estado?: string;
	creadoPor?: string;
	creadoEn: Date;
}

interface AuditoriasCreationAttributes
	extends Optional<
		AuditoriasAttributes,
		| "id"
		| "tipo"
		| "objetivo"
		| "alcance"
		| "normaReferencia"
		| "auditorLiderId"
		| "fechaPlanificada"
		| "fechaInicio"
		| "fechaFin"
		| "estado"
		| "creadoPor"
		| "creadoEn"
	> {}

class Auditorias
	extends Model<AuditoriasAttributes, AuditoriasCreationAttributes>
	implements AuditoriasAttributes
{
	public id!: string;
	public codigo!: string;
	public tipo?: string;
	public objetivo?: string;
	public alcance?: string;
	public normaReferencia?: string;
	public auditorLiderId?: string;
	public fechaPlanificada?: Date;
	public fechaInicio?: Date;
	public fechaFin?: Date;
	public estado?: string;
	public creadoPor?: string;
	public readonly creadoEn!: Date;

	public static initModel(sequelize: Sequelize): typeof Auditorias {
		return Auditorias.init(
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
				tipo: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				objetivo: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				alcance: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				normaReferencia: {
					type: DataTypes.STRING(100),
					allowNull: true,
					field: "norma_referencia",
				},
				auditorLiderId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "auditor_lider_id",
				},
				fechaPlanificada: {
					type: DataTypes.DATEONLY,
					allowNull: true,
					field: "fecha_planificada",
				},
				fechaInicio: {
					type: DataTypes.DATEONLY,
					allowNull: true,
					field: "fecha_inicio",
				},
				fechaFin: {
					type: DataTypes.DATEONLY,
					allowNull: true,
					field: "fecha_fin",
				},
				estado: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				creadoPor: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "creado_por",
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
				tableName: "auditorias",
				modelName: "auditorias",
				timestamps: false,
				underscored: true,
			},
		);
	}

	public static associate(models: any): void {
		Auditorias.belongsTo(models.Usuario, { foreignKey: "auditorLiderId", as: "auditorLider" });
		Auditorias.belongsTo(models.Usuario, { foreignKey: "creadoPor", as: "creadoPorUsuario" });
		Auditorias.hasMany(models.HallazgoAuditoria, { foreignKey: "auditoriaId", as: "hallazgos" });
	}
}

export default Auditorias;

