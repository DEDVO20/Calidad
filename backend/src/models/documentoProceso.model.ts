import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface DocumentoProcesoAttributes {
  id: string;
  instanciaId: string;
  documentoId: string;
  nota?: string;
  adjuntadoEn?: Date;
}

interface DocumentoProcesoCreationAttributes
  extends Optional<DocumentoProcesoAttributes, "id" | "nota" | "adjuntadoEn"> {}

class DocumentoProceso
  extends Model<DocumentoProcesoAttributes, DocumentoProcesoCreationAttributes>
  implements DocumentoProcesoAttributes
{
  public id!: string;
  public instanciaId!: string;
  public documentoId!: string;
  public nota?: string;
  public adjuntadoEn?: Date;

  public static initModel(sequelize: Sequelize): typeof DocumentoProceso {
    return DocumentoProceso.init(
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
        documentoId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "documento_id",
        },
        nota: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        adjuntadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: "adjuntado_en",
        },
      },
      {
        sequelize,
        tableName: "documento_proceso",
        modelName: "DocumentoProceso",
        timestamps: false,
        underscored: true,
      },
    );
  }
  public static associate(models: any): void {
    DocumentoProceso.belongsTo(models.InstanciaProceso, {
      foreignKey: "instanciaId",
      as: "instancia",
    });
    DocumentoProceso.belongsTo(models.Documento, {
      foreignKey: "documentoId",
      as: "documento",
    });
  }
}

export default DocumentoProceso;
