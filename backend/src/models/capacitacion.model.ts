import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface CapacitacionAttributes {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipoCapacitacion: string;
  modalidad: string;
  duracionHoras?: number;
  instructor?: string;
  fechaProgramada?: Date;
  fechaRealizacion?: Date;
  lugar?: string;
  estado: string;
  objetivo?: string;
  contenido?: string;
  responsableId?: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

interface CapacitacionCreationAttributes
  extends Optional<
    CapacitacionAttributes,
    | "id"
    | "descripcion"
    | "duracionHoras"
    | "instructor"
    | "fechaProgramada"
    | "fechaRealizacion"
    | "lugar"
    | "objetivo"
    | "contenido"
    | "responsableId"
    | "creadoEn"
    | "actualizadoEn"
  > {}

class Capacitacion
  extends Model<CapacitacionAttributes, CapacitacionCreationAttributes>
  implements CapacitacionAttributes
{
  public id!: string;
  public codigo!: string;
  public nombre!: string;
  public descripcion?: string;
  public tipoCapacitacion!: string;
  public modalidad!: string;
  public duracionHoras?: number;
  public instructor?: string;
  public fechaProgramada?: Date;
  public fechaRealizacion?: Date;
  public lugar?: string;
  public estado!: string;
  public objetivo?: string;
  public contenido?: string;
  public responsableId?: string;
  public readonly creadoEn!: Date;
  public readonly actualizadoEn!: Date;

  public static initModel(sequelize: Sequelize): typeof Capacitacion {
    return Capacitacion.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        codigo: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        nombre: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        tipoCapacitacion: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: "tipo_capacitacion",
        },
        modalidad: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        duracionHoras: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: "duracion_horas",
        },
        instructor: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        fechaProgramada: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "fecha_programada",
        },
        fechaRealizacion: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "fecha_realizacion",
        },
        lugar: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        estado: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: "programada",
        },
        objetivo: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        contenido: {
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
        actualizadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: "actualizado_en",
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
