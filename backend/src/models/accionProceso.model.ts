import { Model, DataTypes, Sequelize, Optional } from "sequelize";

interface AccionProcesoAttributes {
  id: string;
  instanciaId: string;
  etapaId: string;
  ejecutadoPor?: string;
  tipoAccion: string;
  comentario?: string;
  ejecutadoEn: Date;
  tiempoRespuestaSegundos: number;
}

interface AccionProcesoCreationAttributes
  extends Optional<
    AccionProcesoAttributes,
    "id" | "ejecutadoPor" | "comentario" | "tiempoRespuestaSegundos"
  > {}

class AccionProceso
  extends Model<AccionProcesoAttributes, AccionProcesoCreationAttributes>
  implements AccionProcesoAttributes
{
  public id!: string;
  public instanciaId!: string;
  public etapaId!: string;
  public ejecutadoPor?: string;
  public tipoAccion!: string;
  public comentario?: string;
  public ejecutadoEn!: Date;
  public tiempoRespuestaSegundos!: number;

  public static initModel(sequelize: Sequelize) {
    AccionProceso.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        instanciaId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "instancia_id",
        },
        etapaId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "etapa_id",
        },
        ejecutadoPor: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "ejecutado_por",
        },
        tipoAccion: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "tipo_accion",
        },
        comentario: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        ejecutadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "ejecutado_en",
        },
        tiempoRespuestaSegundos: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "tiempo_respuesta_segundos",
        },
      },
      {
        sequelize,
        tableName: "acciones_proceso",
        modelName: "AccionProceso",
        timestamps: false,
        underscored: true,
        indexes: [
          { name: "idx_acciones_instancias", fields: ["instancia_id"] },
        ],
      },
    );
  }

  public static associate(models: any): void {
    AccionProceso.belongsTo(models.EtapaProceso, {
      foreignKey: "etapaId",
      as: "etapa",
    });
    AccionProceso.belongsTo(models.InstanciaProceso, {
      foreignKey: "instanciaId",
      as: "instancia",
    });
    AccionProceso.belongsTo(models.Usuario, {
      foreignKey: "ejecutadoPor",
      as: "usuario",
    });
  }
}

export default AccionProceso;
