import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface DocumentoAttributes {
  id: string;
  nombreArchivo: string;
  rutaAlmacenamiento?: string;
  tipoMime?: string;
  tamañoBytes?: number;
  subidoPor?: string;
  creadoEn?: Date;
  visibilidad?: string;
  tipoDocumento?: string;
  codigoDocumento?: string;
  version?: string;
  estado?: string;
  aprobadoPor?: string;
  fechaAprobacion?: Date;
  proximaRevision?: Date;
}

interface DocumentoCreationAttributes
  extends Optional<
    DocumentoAttributes,
    | "id"
    | "rutaAlmacenamiento"
    | "tipoMime"
    | "tamañoBytes"
    | "subidoPor"
    | "creadoEn"
    | "visibilidad"
    | "tipoDocumento"
    | "codigoDocumento"
    | "version"
    | "estado"
    | "aprobadoPor"
    | "fechaAprobacion"
    | "proximaRevision"
  > {}

class Documento
  extends Model<DocumentoAttributes, DocumentoCreationAttributes>
  implements DocumentoAttributes
{
  id!: string;
  nombreArchivo!: string;
  rutaAlmacenamiento?: string;
  tipoMime?: string;
  tamañoBytes?: number;
  subidoPor?: string;
  creadoEn?: Date;
  visibilidad?: string;
  tipoDocumento?: string;
  codigoDocumento?: string;
  version?: string;
  estado?: string;
  aprobadoPor?: string;
  fechaAprobacion?: Date;
  proximaRevision?: Date;

  public static initModel(sequelize: Sequelize): typeof Documento {
    return Documento.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        nombreArchivo: {
          type: DataTypes.STRING(500),
          allowNull: false,
          field: "nombre_archivo",
        },
        rutaAlmacenamiento: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "ruta_almacenamiento",
        },
        tipoMime: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: "tipo_mime",
        },
        tamañoBytes: {
          type: DataTypes.BIGINT,
          allowNull: true,
          field: "tamaño_bytes",
        },
        subidoPor: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "subido_por",
        },
        creadoEn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "creado_en",
        },
        visibilidad: {
          type: DataTypes.STRING(50),
          defaultValue: "privado",
        },
        tipoDocumento: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: "tipo_documento",
        },
        codigoDocumento: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: "codigo_documento",
        },
        version: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        estado: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        aprobadoPor: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        fechaAprobacion: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "fecha_aprobacion",
        },
        proximaRevision: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "proxima_revision",
        },
      },
      {
        sequelize,
        tableName: "documentos",
        modelName: "Documento",
        timestamps: false,
        underscored: true,
      },
    );
  }

  public static associate(models: any) {
    Documento.belongsTo(models.Usuario, {
      foreignKey: "subidoPor",
      as: "autor",
    });
    Documento.belongsTo(models.Usuario, {
      foreignKey: "aprobadoPor",
      as: "aprobador",
    });
    Documento.hasMany(models.VersionDocumento, {
      foreignKey: "documentoId",
      as: "versiones",
    });
    Documento.hasMany(models.DocumentoProceso, {
      foreignKey: "documentoId",
      as: "procesosRelacionados",
    });
  }
}

export default Documento;
