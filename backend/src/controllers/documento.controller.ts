import { Request, Response } from "express";
import { Op, UUIDV4 } from "sequelize";
import Documento from "../models/documento.model";
import {
  uploadFileToSupabase,
  deleteFileFromSupabase,
} from "../utils/supabase";

/** Crear documento */
export const createDocumento = async (req: Request, res: Response) => {
  try {
    const {
      codigo,
      nombre,
      descripcion,
      nombreArchivo,
      rutaAlmacenamiento,
      tipoMime,
      tamañoBytes,
      subidoPor,
      creadoPor,
      revisadoPor,
      visibilidad,
      tipoDocumento,
      codigoDocumento,
      version,
      versionActual,
      estado,
      aprobadoPor,
      fechaAprobacion,
      fechaVigencia,
      proximaRevision,
      contenidoHtml,
      rutaArchivo,
    } = req.body;

    // Validar campos obligatorios
    if (!codigo) {
      return res
        .status(400)
        .json({ message: "El campo 'codigo' es obligatorio." });
    }
    if (!nombre) {
      return res
        .status(400)
        .json({ message: "El campo 'nombre' es obligatorio." });
    }
    if (!tipoDocumento) {
      return res
        .status(400)
        .json({ message: "El campo 'tipoDocumento' es obligatorio." });
    }

    const doc = await Documento.create({
      codigo,
      nombre,
      descripcion,
      nombreArchivo: nombreArchivo || nombre,
      rutaAlmacenamiento,
      tipoMime,
      tamañoBytes,
      subidoPor: subidoPor || creadoPor,
      creadoPor,
      revisadoPor: revisadoPor || null,
      visibilidad: visibilidad || "privado",
      tipoDocumento,
      codigoDocumento: codigoDocumento || codigo,
      version,
      versionActual: versionActual || "1.0",
      estado: estado || "borrador",
      aprobadoPor,
      fechaAprobacion,
      fechaVigencia,
      proximaRevision,
      contenidoHtml,
      rutaArchivo,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    return res.status(201).json(doc);
  } catch (error: any) {
    console.error("Error al crear documento:", error);
    return res
      .status(500)
      .json({ message: "Error al crear documento", error: error.message });
  }
};

/** Listar documentos con filtros y paginación */
export const getDocumentos = async (req: Request, res: Response) => {
  try {
    console.log("🔍 getDocumentos - Iniciando...");
    const {
      q, // búsqueda por nombre/código (texto)
      estado,
      tipoDocumento,
      visibilidad,
      page = "1",
      limit = "20",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit as string, 10) || 20, 1);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};

    if (estado) where.estado = estado;
    if (tipoDocumento) where.tipoDocumento = tipoDocumento;
    if (visibilidad) where.visibilidad = visibilidad;

    if (q && q.trim()) {
      where[Op.or] = [
        { nombreArchivo: { [Op.iLike]: `%${q}%` } },
        { codigoDocumento: { [Op.iLike]: `%${q}%` } },
      ];
    }

    console.log("🔍 Where clause:", JSON.stringify(where, null, 2));
    console.log("🔍 Ejecutando findAndCountAll...");

    const { rows, count } = await Documento.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [["creadoEn", "DESC"]],
      // TODO: Re-enable when associations are properly configured
      // include: [
      //   { association: "autor" },
      //   { association: "revisor" },
      //   { association: "aprobador" },
      //   { association: "subidor" },
      //   { association: "versiones" },
      //   { association: "procesosRelacionados" },
      // ],
    });

    console.log("✅ Query exitosa. Count:", count, "Rows:", rows.length);

    return res.json({
      items: rows,
      total: count,
      page: pageNum,
      pages: Math.ceil(count / limitNum),
      limit: limitNum,
    });
  } catch (error: any) {
    console.error("❌ ERROR en getDocumentos:");
    console.error("❌ Message:", error.message);
    console.error("❌ Stack:", error.stack);
    console.error("❌ Full error:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener documentos", error: error.message });
  }
};

/** Obtener documento por ID */
export const getDocumentoById = async (req: Request, res: Response) => {
  try {
    const doc = await Documento.findByPk(req.params.id, {
      // include: [
      //   { association: "autor" },
      //   { association: "revisor" },
      //   { association: "aprobador" },
      //   { association: "subidor" },
      //   { association: "versiones" },
      //   { association: "procesosRelacionados" },
      // ],
    });

    if (!doc)
      return res.status(404).json({ message: "Documento no encontrado" });
    return res.json(doc);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error al obtener documento", error: error.message });
  }
};

/** Actualizar documento por ID */
export const updateDocumento = async (req: Request, res: Response) => {
  try {
    const doc = await Documento.findByPk(req.params.id);
    if (!doc)
      return res.status(404).json({ message: "Documento no encontrado" });

    const {
      nombreArchivo,
      rutaAlmacenamiento,
      tipoMime,
      tamañoBytes,
      subidoPor,
      visibilidad,
      tipoDocumento,
      codigoDocumento,
      version,
      estado,
      creadoPor,
      revisadoPor,
      aprobadoPor,
      fechaAprobacion,
      proximaRevision,
      contenidoHtml,
      cambios, // Descripción de cambios para la versión
    } = req.body;

    const archivo = req.file;

    // Si hay archivo nuevo, crear versión del documento actual y subir el nuevo
    if (archivo) {
      // 1. Crear versión del estado actual del documento (antes de actualizar)
      if (doc.rutaAlmacenamiento) {
        const VersionDocumento = require("../models/versionDocumento.model").default;

        // Obtener el último número de versión
        const ultimaVersion = await VersionDocumento.findOne({
          where: { documentoId: doc.id },
          order: [["numeroVersion", "DESC"]],
        });

        const nuevoNumeroVersion = ultimaVersion ? ultimaVersion.numeroVersion + 1 : 1;

        // Calcular versión string (formato semántico)
        const versionActualArray = (doc.versionActual || "1.0").split(".");
        const major = parseInt(versionActualArray[0] || "1");
        const minor = parseInt(versionActualArray[1] || "0");

        // Incrementar versión (por ahora solo incrementamos el minor)
        const nuevaVersionString = `${major}.${minor + 1}`;

        // Crear registro de la versión anterior
        await VersionDocumento.create({
          documentoId: doc.id,
          numeroVersion: nuevoNumeroVersion,
          versionString: doc.versionActual || "1.0",
          subidoPor: subidoPor || doc.subidoPor,
          cambios: cambios || "Actualización de documento",
          rutaArchivo: doc.rutaArchivo,
          archivoUrl: doc.rutaAlmacenamiento,
          estado: "historica",
          nombreArchivo: doc.nombreArchivo,
          tamañoBytes: doc.tamañoBytes,
        });

        console.log(`✅ Versión ${doc.versionActual} guardada en historial`);
      }

      // 2. Subir nuevo archivo a Supabase con path versionado
      const extension = archivo.originalname.split(".").pop();
      const versionActualArray = (doc.versionActual || "1.0").split(".");
      const major = parseInt(versionActualArray[0] || "1");
      const minor = parseInt(versionActualArray[1] || "0");
      const nuevaVersionString = `${major}.${minor + 1}`;

      // Path: documentos/{documentoId}/v{version}_{filename}
      const filename = `${doc.id}/v${nuevaVersionString}_${UUIDV4()}.${extension}`;

      const { url } = await uploadFileToSupabase(
        filename,
        archivo.buffer,
        "documentos",
      );

      // 3. Actualizar documento con nueva información
      await doc.update({
        nombreArchivo: nombreArchivo || archivo.originalname,
        rutaAlmacenamiento: url,
        rutaArchivo: filename,
        tipoMime: archivo.mimetype,
        tamañoBytes: archivo.size,
        versionActual: nuevaVersionString,
        subidoPor,
        visibilidad,
        tipoDocumento,
        codigoDocumento,
        version: nuevaVersionString,
        estado,
        aprobadoPor,
        fechaAprobacion,
        proximaRevision,
        creadoPor,
        revisadoPor,
        contenidoHtml,
        actualizadoEn: new Date(),
      });

      console.log(`✅ Documento actualizado a versión ${nuevaVersionString}`);
    } else {
      // Si no hay archivo, solo actualizar metadata
      await doc.update({
        nombreArchivo,
        tipoDocumento,
        codigoDocumento,
        version,
        visibilidad,
        estado,
        proximaRevision,
        creadoPor,
        revisadoPor,
        aprobadoPor,
        fechaAprobacion,
        contenidoHtml,
        actualizadoEn: new Date(),
      });
    }
    return res.json(doc);
  } catch (error: any) {
    console.error("❌ Error al actualizar documento:", error);
    return res
      .status(500)
      .json({ message: "Error al actualizar documento", error: error.message });
  }
};

/** Eliminar documento */
export const deleteDocumento = async (req: Request, res: Response) => {
  try {
    const doc = await Documento.findByPk(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    // Eliminar archivo de Supabase si existe
    if (doc.rutaAlmacenamiento) {
      try {
        const filePath = doc.rutaAlmacenamiento.split("/").pop();
        if (filePath) {
          await deleteFileFromSupabase(filePath);
        }
      } catch (error) {
        console.error("Error al eliminar archivo de Supabase:", error);
      }
    }

    // Eliminar registro de BD
    await doc.destroy();

    return res.status(204).send();
  } catch (error: any) {
    console.error("Error al eliminar documento:", error);
    return res
      .status(500)
      .json({ message: "Error al eliminar documento", error: error.message });
  }
};
