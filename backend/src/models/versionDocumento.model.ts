import { DataTypes, Optional, Model, Sequelize } from "sequelize";

interface VersionDocumentoAttributes {
  id: string;
  documentoId: string;
  numeroVersion: number;
  versionString: string; // Versión en formato "1.0", "1.1", etc.
  subidoEn?: Date;
  subidoPor?: string;
  cambios?: string;
  rutaArchivo?: string;
  archivoUrl?: string; // URL completa del archivo en Supabase
  estado?: string; // 'activa' o 'historica'
  nombreArchivo?: string; // Nombre original del archivo
  tamañoBytes?: number; // Tamaño del archivo
}

interface VersionDocumentoCreationAttributes
  extends Optional<
    VersionDocumentoAttributes,
    "id" | "subidoEn" | "subidoPor" | "cambios" | "rutaArchivo" | "archivoUrl" | "estado" | "nombreArchivo" | "tamañoBytes"
  > { }

class VersionDocumento
  extends Model<VersionDocumentoAttributes, VersionDocumentoCreationAttributes>
  implements VersionDocumentoAttributes {
  public id!: string;
  public documentoId!: string;
  public numeroVersion!: number;
  public versionString!: string;
  public subidoEn?: Date;
  public subidoPor?: string;
  public cambios?: string;
  public rutaArchivo?: string;
  public archivoUrl?: string;
  public estado?: string;
  public nombreArchivo?: string;
  public tamañoBytes?: number;

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
        versionString: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: "version_string",
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
        archivoUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "archivo_url",
        },
        estado: {
          type: DataTypes.STRING(20),
          allowNull: true,
          defaultValue: "historica",
        },
        nombreArchivo: {
          type: DataTypes.STRING(500),
          allowNull: true,
          field: "nombre_archivo",
        },
        tamañoBytes: {
          type: DataTypes.BIGINT,
          allowNull: true,
          field: "tamaño_bytes",
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
