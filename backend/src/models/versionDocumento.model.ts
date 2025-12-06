import { DataTypes, Optional, Model, Sequelize } from "sequelize";

interface VersionDocumentoAttributes {
  id: string;
  documentoId: string;
  version?: string; // Columna version en la BD
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
  // Campos para snapshot de metadata
  contenidoHtml?: string; // Snapshot del contenido HTML
  estadoDocumento?: string; // Snapshot del estado del documento
  tipoDocumento?: string; // Snapshot del tipo de documento
  codigoDocumento?: string; // Snapshot del código del documento
  metadataSnapshot?: any; // Metadata adicional en JSON
  tieneArchivo?: boolean; // Indica si esta versión tiene archivo asociado
}

interface VersionDocumentoCreationAttributes
  extends Optional<
    VersionDocumentoAttributes,
    "id" | "version" | "subidoEn" | "subidoPor" | "cambios" | "rutaArchivo" | "archivoUrl" | "estado" | "nombreArchivo" | "tamañoBytes" | "contenidoHtml" | "estadoDocumento" | "tipoDocumento" | "codigoDocumento" | "metadataSnapshot" | "tieneArchivo"
  > { }

class VersionDocumento
  extends Model<VersionDocumentoAttributes, VersionDocumentoCreationAttributes>
  implements VersionDocumentoAttributes {
  public id!: string;
  public documentoId!: string;
  public version?: string;
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
  // Campos para snapshot de metadata
  public contenidoHtml?: string;
  public estadoDocumento?: string;
  public tipoDocumento?: string;
  public codigoDocumento?: string;
  public metadataSnapshot?: any;
  public tieneArchivo?: boolean;

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
        version: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: "version",
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
          field: "creado_en",
        },
        subidoPor: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "creado_por",
        },
        cambios: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "descripcion_cambios",
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
        contenidoHtml: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "contenido_html",
        },
        estadoDocumento: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: "estado_documento",
        },
        tipoDocumento: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: "tipo_documento",
        },
        codigoDocumento: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: "codigo_documento",
        },
        metadataSnapshot: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: "metadata_snapshot",
        },
        tieneArchivo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: "tiene_archivo",
        },
      },
      {
        sequelize,
        tableName: "version_documentos", // Nombre real de la tabla en la BD
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
