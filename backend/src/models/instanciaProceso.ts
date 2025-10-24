import { DataTypes, Optional, Model, Sequelize } from "sequelize";

interface InstanciaProcesoAttributes {
  id: string;
  procesoId: string;
  iniciadoPor?: string;
  estado: string;
  iniciadoEn: Date;
  completadoEn?: Date;
  etapaActualId: string;
  datos?: object;
  bloqueado?: boolean;
  razonBloqueo?: string;
  creadoEn: Date;
  actualizadoEn?: Date;
}

interface InstanciaProcesoCreationAttributes
  extends Optional<
    InstanciaProcesoAttributes,
    | "id"
    | "iniciadoPor"
    | "completadoEn"
    | "etapaActualId"
    | "datos"
    | "bloqueado"
    | "razonBloqueo"
    | "creadoEn"
    | "actualizadoEn"
    | "actualizadoEn"
  > {}

class InstanciaProceso
  extends Model<InstanciaProcesoAttributes, InstanciaProcesoCreationAttributes>
  implements InstanciaProcesoAttributes
{
  public id!: string;
  public procesoId!: string;
  public iniciadoPor?: string;
  public estado!: string;
  public iniciadoEn!: Date;
  public completadoEn?: Date;
  public etapaActualId!: string;
  public datos?: object;
  public bloqueado?: boolean;
  public razonBloqueo?: string;
  public creadoEn!: Date;
  public actualizadoEn?: Date;

  public static initModel(sequelize: Sequelize): void {
    InstanciaProceso.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        procesoId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "proceso_id",
        },
        iniciadoPor: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "iniciado_por",
        },
        estado: {
          type: DataTypes.STRING,
          defaultValue: "borrador",
          allowNull: false,
        },
        iniciadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "iniciado_en",
        },
        completadoEn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "completado_en",
        },
        etapaActualId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "etapa_actual_id",
        },
        datos: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        bloqueado: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        razonBloqueo: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "razon_bloqueo",
        },
        creadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "creado_en",
        },
        actualizadoEn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "actualizado_en",
        },
      },
      {
        sequelize,
        modelName: "instancias_proceso",
        tableName: "InstanciaProceso",
        timestamps: false,
        underscored: true,
        indexes: [{ name: "idx_instancia_estado", fields: ["estado"] }],
      },
    );
  }

  public static associate(models: any): void {
    InstanciaProceso.belongsTo(models.Proceso, {
      foreignKey: "procesoId",
      as: "proceso",
    });
    InstanciaProceso.belongsTo(models.EtapaProceso, {
      foreignKey: "etapaActualId",
      as: "etapaActual",
    });
    InstanciaProceso.belongsTo(models.Usuario, {
      foreignKey: "iniciadoPor",
      as: "creado",
    });
    InstanciaProceso.belongsTo(models.AccionProceso, {
      foreignKey: "instanciaId",
      as: "acciones",
    });
    InstanciaProceso.belongsTo(models.ParticipanteProceso, {
      foreignKey: "instanciaId",
      as: "participantes",
    });
  }
}

export default InstanciaProceso;
