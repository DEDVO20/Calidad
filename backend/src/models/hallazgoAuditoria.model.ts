
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface HallazgoAuditoriaAttributes {
	id: string;
	auditoriaId: string;
	tipo?: string;
	descripcion?: string;
	clausulaIso?: string;
	procesoId?: string;
	areaId?: string;
	evidencia?: string;
	responsableId?: string;
	creadoEn: Date;
}

interface HallazgoAuditoriaCreationAttributes
	extends Optional<
		HallazgoAuditoriaAttributes,
		| "id"
		| "tipo"
		| "descripcion"
		| "clausulaIso"
		| "procesoId"
		| "areaId"
		| "evidencia"
		| "responsableId"
		| "creadoEn"
	> {}

class HallazgoAuditoria
	extends Model<HallazgoAuditoriaAttributes, HallazgoAuditoriaCreationAttributes>
	implements HallazgoAuditoriaAttributes
{
	public id!: string;
	public auditoriaId!: string;
	public tipo?: string;
	public descripcion?: string;
	public clausulaIso?: string;
	public procesoId?: string;
	public areaId?: string;
	public evidencia?: string;
	public responsableId?: string;
	public readonly creadoEn!: Date;

	public static initModel(sequelize: Sequelize): typeof HallazgoAuditoria {
		return HallazgoAuditoria.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				auditoriaId: {
					type: DataTypes.UUID,
					allowNull: false,
					field: "auditoria_id",
				},
				tipo: {
					type: DataTypes.STRING(50),
					allowNull: true,
				},
				descripcion: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				clausulaIso: {
					type: DataTypes.STRING(50),
					allowNull: true,
					field: "clausula_iso",
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
				evidencia: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				responsableId: {
					type: DataTypes.UUID,
					allowNull: true,
					field: "responsable_id",
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
				tableName: "hallazgos_auditoria",
				modelName: "hallazgoAuditoria",
				timestamps: false,
				underscored: true,
			},
		);
	}

	public static associate(models: any): void {
		HallazgoAuditoria.belongsTo(models.Auditorias, { foreignKey: "auditoriaId", as: "auditoria" });
		HallazgoAuditoria.belongsTo(models.Proceso, { foreignKey: "procesoId", as: "proceso" });
		HallazgoAuditoria.belongsTo(models.Area, { foreignKey: "areaId", as: "area" });
		HallazgoAuditoria.belongsTo(models.Usuario, { foreignKey: "responsableId", as: "responsable" });
	}
}

export default HallazgoAuditoria;

