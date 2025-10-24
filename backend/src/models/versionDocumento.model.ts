import { DataTypes, Optional, Model, Sequelize } from "sequelize";

interface VersionDocumentoAttributes {
  id: string;
  documentoId: string;
  numeroVersion: number;
  subidoEn?: Date;
  subidoPor?: string;
  cambios?: string;
  rutaArchivo?: string;
}

interface VersionDocumentoCreationAttributes
  extends Optional<
    VersionDocumentoAttributes,
    "id" | "subidoEn" | "subidoPor" | "cambios" | "rutaArchivo"
  > {}

class VersionDocumento
  extends Model<VersionDocumentoAttributes, VersionDocumentoCreationAttributes>
  implements VersionDocumentoAttributes
{
  public id!: string;
  public documentoId!: string;
  public numeroVersion!: number;
  public subidoEn?: Date;
  public subidoPor?: string;
  public cambios?: string;
  public rutaArchivo?: string;

  static initModel(sequelize: Sequelize): typeof VersionDocumento {
    return VersionDocumento.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        documentoId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "documento_id",
        },
        numeroVersion: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "numero_version",
        },
        subidoEn: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: "subido_en",
        },
        subidoPor: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "subido_por",
        },
        cambios: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        rutaArchivo: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "ruta_archivo",
        },
      },
      {
        sequelize,
        tableName: "versiones_documento",
        modelName: "VersionDocumento",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any): void {
    VersionDocumento.belongsTo(models.Documento, {
      foreignKey: "documentoId",
      as: "documento",
    });
    VersionDocumento.belongsTo(models.Usuario, {
      foreignKey: "subidoPor",
      as: "autor",
    });
  }
}

export default VersionDocumento;
