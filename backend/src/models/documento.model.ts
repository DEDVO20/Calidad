import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface DocumentoAttributes {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipoDocumento: string;
  rutaArchivo?: string;
  versionActual: string;
  estado: string;
  fechaAprobacion?: Date;
  fechaVigencia?: Date;
  creadoPor?: string;
  aprobadoPor?: string;
  creadoEn: Date;
  actualizadoEn: Date;
  nombreArchivo: string;
  rutaAlmacenamiento?: string;
  tipoMime?: string;
  tamañoBytes?: number;
  subidoPor?: string;
  revisadoPor?: string;
  visibilidad?: string;
  codigoDocumento?: string;
  version?: string;
  proximaRevision?: Date;
  contenidoHtml?: string;
}

interface DocumentoCreationAttributes
  extends Optional<
    DocumentoAttributes,
    | "id"
    | "descripcion"
    | "rutaArchivo"
    | "versionActual"
    | "estado"
    | "fechaAprobacion"
    | "fechaVigencia"
    | "creadoPor"
    | "aprobadoPor"
    | "creadoEn"
    | "actualizadoEn"
    | "rutaAlmacenamiento"
    | "tipoMime"
    | "tamañoBytes"
    | "subidoPor"
    | "revisadoPor"
    | "visibilidad"
    | "codigoDocumento"
    | "version"
    | "proximaRevision"
    | "contenidoHtml"
  > { }

class Documento
  extends Model<DocumentoAttributes, DocumentoCreationAttributes>
  implements DocumentoAttributes {
  id!: string;
  codigo!: string;
  nombre!: string;
  descripcion?: string;
  tipoDocumento!: string;
  rutaArchivo?: string;
  versionActual!: string;
  estado!: string;
  fechaAprobacion?: Date;
  fechaVigencia?: Date;
  creadoPor?: string;
  aprobadoPor?: string;
  creadoEn!: Date;
  actualizadoEn!: Date;
  nombreArchivo!: string;
  rutaAlmacenamiento?: string;
  tipoMime?: string;
  tamañoBytes?: number;
  subidoPor?: string;
  revisadoPor?: string;
  visibilidad?: string;
  codigoDocumento?: string;
  version?: string;
  proximaRevision?: Date;
  contenidoHtml?: string;

  public static initModel(sequelize: Sequelize): typeof Documento {
    return Documento.init(
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
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        tipoDocumento: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: "tipo_documento",
        },
        rutaArchivo: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "ruta_archivo",
        },
        versionActual: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: "1.0",
          field: "version_actual",
        },
        estado: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: "borrador",
        },
        fechaAprobacion: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "fecha_aprobacion",
        },
        fechaVigencia: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "fecha_vigencia",
        },
        creadoPor: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "creado_por",
          references: {
            model: "usuarios",
            key: "id",
          },
        },
        aprobadoPor: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "aprobado_por",
          references: {
            model: "usuarios",
            key: "id",
          },
        },
        creadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "creado_en",
        },
        actualizadoEn: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "actualizado_en",
        },
        nombreArchivo: {
          type: DataTypes.STRING(500),
          allowNull: false,
          defaultValue: "documento",
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
          references: {
            model: "usuarios",
            key: "id",
          },
        },
        revisadoPor: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "revisado_por",
          references: {
            model: "usuarios",
            key: "id",
          },
        },
        visibilidad: {
          type: DataTypes.STRING(50),
          allowNull: true,
          defaultValue: "privado",
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
        proximaRevision: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          field: "proxima_revision",
        },
        contenidoHtml: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "contenido_html",
        },
      },
      {
        sequelize,
        tableName: "documentos",
        modelName: "Documento",
        timestamps: false,
      },
    );
  }

  public static associate(models: any) {
    Documento.belongsTo(models.Usuario, {
      foreignKey: "subidoPor",
      as: "subidor",
    });
    Documento.belongsTo(models.Usuario, {
      foreignKey: "creadoPor",
      as: "autor",
    });
    Documento.belongsTo(models.Usuario, {
      foreignKey: "revisadoPor",
      as: "revisor",
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
