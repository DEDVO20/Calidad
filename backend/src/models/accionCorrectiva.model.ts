import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface AccionCorrectivaAttributes {
  id: string;
  noConformidadId: string;
  codigo: string;
  tipo?: string;
  descripcion?: string;
  analisisCausaRaiz?: string;
  planAccion?: string;
  responsableId?: string;
  fechaCompromiso?: Date;
  fechaImplementacion?: Date;
  estado?: string;
  eficaciaVerificada?: boolean;
  verificadoPor?: string;
  fechaVerificacion?: Date;
  observacion?: string;
  creadoEn?: Date;
  actualizadoEn?: Date;
}

interface AccionCorrectivaCreationAttributes
  extends Optional<
    AccionCorrectivaAttributes,
    | "id"
    | "tipo"
    | "descripcion"
    | "analisisCausaRaiz"
    | "planAccion"
    | "responsableId"
    | "fechaCompromiso"
    | "fechaImplementacion"
    | "estado"
    | "eficaciaVerificada"
    | "verificadoPor"
    | "fechaVerificacion"
    | "observacion"
    | "creadoEn"
    | "actualizadoEn"
  > {}

class AccionCorrectiva
  extends Model<AccionCorrectivaAttributes, AccionCorrectivaCreationAttributes>
  implements AccionCorrectivaAttributes
{
  public id!: string;
  public noConformidadId!: string;
  public codigo!: string;
  public tipo?: string;
  public descripcion?: string;
  public estado?: string;
  public analisisCausaRaiz?: string;
  public planAccion?: string;
  public responsableId?: string;
  public fechaCompromiso?: Date;
  public fechaImplementacion?: Date;
  public eficaciaVerificada?: boolean;
  public verificadoPor?: string;
  public fechaVerificacion?: Date;
  public observacion?: string;
  public creadoEn?: Date;
  public actualizadoEn?: Date; 

  public static initModel(sequelize: Sequelize): typeof AccionCorrectiva {
    return AccionCorrectiva.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        noConformidadId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "no_conformidad_id",
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
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        analisisCausaRaiz: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "analisis_causa_raiz",
        },
        planAccion: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "plan_accion",
        },
        responsableId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "responsable_id",
        },
        fechaCompromiso: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "fecha_compromiso",
        },
        fechaImplementacion: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "fecha_implementacion",
        },
        estado: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        eficaciaVerificada: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: "eficacia_verificada",
        },
        verificadoPor: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "verificado_por",
        },
        fechaVerificacion: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "fecha_verificacion",
        },
        observacion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        creadoEn: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: "creado_en",
        },
        actualizadoEn: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: "actualizado_en",
        },
      },
      {
        sequelize,
        tableName: "acciones_correctivas",
        modelName: "AccionCorrectiva",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any): void {
    this.belongsTo(models.Usuario, {
      foreignKey: "responsableId",
      as: "responsable",
    });
    this.belongsTo(models.Usuario, {
      foreignKey: "verificadoPor",
      as: "verificador",
    });
    this.belongsTo(models.NoConformidad, {
      foreignKey: "noConformidadId",
      as: "noConformidad",
    });
  }
}

export default AccionCorrectiva;
