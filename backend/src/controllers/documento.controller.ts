import { Request, Response } from "express";
import { Op, UUIDV4 } from "sequelize";
import Documento from "../models/documento.model";
import {
  uploadFileToSupabase,
  deleteFileFromSupabase,
} from "../utils/supabase";
import NotificacionesService from "../services/notificaciones.service";

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

    // Obtener el ID del usuario autenticado
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

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
      subidoPor: usuarioId, // Usuario logueado que sube el archivo
      creadoPor: usuarioId, // Usuario logueado que crea el documento
      revisadoPor: revisadoPor || null,
      visibilidad: visibilidad || "privado",
      tipoDocumento,
      codigoDocumento: codigoDocumento || codigo,
      version,
      versionActual: versionActual || "1.0",
      estado: estado || " ",
      aprobadoPor,
      fechaAprobacion,
      fechaVigencia,
      proximaRevision,
      contenidoHtml,
      rutaArchivo,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    // Notificar al revisor si fue asignado (y es diferente al creador)
    if (revisadoPor && revisadoPor !== usuarioId) {
      try {
        await NotificacionesService.notificarAsignacionRevision(
          revisadoPor,
          doc.id,
          doc.nombre
        );
      } catch (notifError) {
        console.error("Error al enviar notificación de revisión:", notifError);
      }
    }

    // Notificar al aprobador si fue asignado (y es diferente al creador)
    if (aprobadoPor && aprobadoPor !== usuarioId) {
      try {
        await NotificacionesService.notificarAsignacionAprobacion(
          aprobadoPor,
          doc.id,
          doc.nombre
        );
      } catch (notifError) {
        console.error("Error al enviar notificación de aprobación:", notifError);
      }
    }

    return res.status(201).json(doc);
  } catch (error: any) {
    console.error("Error al crear documento:", error);

    // Manejar error de código duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.parent?.constraint === 'documentos_codigo_key') {
        return res.status(400).json({
          message: "Ya existe un documento con ese código",
          error: `El código '${req.body.codigo}' ya está en uso. Por favor, utiliza un código diferente.`,
          field: 'codigo'
        });
      }
    }

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

    // Obtener el ID del usuario autenticado
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const archivo = req.file;
    const VersionDocumento = require("../models/versionDocumento.model").default;

    // Helper: Detectar si hay cambios significativos en metadata
    const hayCambiosSignificativos = () => {
      const camposCriticos = [
        { campo: 'contenidoHtml', valorActual: doc.contenidoHtml, valorNuevo: contenidoHtml },
        { campo: 'estado', valorActual: doc.estado, valorNuevo: estado },
        { campo: 'nombreArchivo', valorActual: doc.nombreArchivo, valorNuevo: nombreArchivo },
        { campo: 'tipoDocumento', valorActual: doc.tipoDocumento, valorNuevo: tipoDocumento },
      ];

      return camposCriticos.some(({ valorActual, valorNuevo }) =>
        valorNuevo !== undefined && valorNuevo !== null && valorActual !== valorNuevo
      );
    };

    // Helper: Obtener siguiente número de versión
    const obtenerSiguienteNumeroVersion = async () => {
      const ultimaVersion = await VersionDocumento.findOne({
        where: { documentoId: doc.id },
        order: [["numeroVersion", "DESC"]],
      });
      return ultimaVersion ? ultimaVersion.numeroVersion + 1 : 1;
    };

    // Helper: Calcular nueva versión string
    const calcularNuevaVersion = (esArchivoNuevo: boolean) => {
      const versionActualArray = (doc.versionActual || "1.0").split(".");
      const major = parseInt(versionActualArray[0] || "1");
      const minor = parseInt(versionActualArray[1] || "0");
      const patch = parseInt(versionActualArray[2] || "0");

      if (esArchivoNuevo) {
        // Archivo nuevo: incrementa MINOR (1.0 -> 1.1)
        return `${major}.${minor + 1}.0`;
      } else {
        // Solo metadata: incrementa PATCH (1.0.0 -> 1.0.1)
        return `${major}.${minor}.${patch + 1}`;
      }
    };

    // Helper: Crear snapshot de la versión actual
    const crearSnapshotVersion = async (esArchivoNuevo: boolean, descripcionCambios: string) => {
      const nuevoNumeroVersion = await obtenerSiguienteNumeroVersion();

      await VersionDocumento.create({
        documentoId: doc.id,
        version: doc.versionActual || doc.version || "1.0",
        numeroVersion: nuevoNumeroVersion,
        versionString: doc.versionActual || "1.0",
        subidoPor: usuarioId, // Usuario logueado que hace el cambio
        cambios: descripcionCambios,
        // Datos del archivo (si existe)
        rutaArchivo: doc.rutaArchivo,
        archivoUrl: doc.rutaAlmacenamiento,
        nombreArchivo: doc.nombreArchivo,
        tamañoBytes: doc.tamañoBytes,
        tieneArchivo: !!doc.rutaAlmacenamiento,
        // Snapshot de metadata
        contenidoHtml: doc.contenidoHtml,
        estadoDocumento: doc.estado,
        tipoDocumento: doc.tipoDocumento,
        codigoDocumento: doc.codigoDocumento,
        estado: "historica",
        metadataSnapshot: {
          visibilidad: doc.visibilidad,
          proximaRevision: doc.proximaRevision,
          creadoPor: doc.creadoPor,
          revisadoPor: doc.revisadoPor,
        },
      });

      console.log(`📸 Versión ${doc.versionActual} guardada en historial`);
    };

    // Si hay archivo nuevo, crear versión del documento actual y subir el nuevo
    if (archivo) {
      // 1. Crear versión del estado actual del documento (antes de actualizar)
      if (doc.rutaAlmacenamiento) {
        await crearSnapshotVersion(true, cambios || "Actualización con archivo nuevo");
      }

      // 2. Subir nuevo archivo a Supabase con path versionado
      const extension = archivo.originalname.split(".").pop();
      const nuevaVersionString = calcularNuevaVersion(true);

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

      console.log(`✅ Documento actualizado a versión ${nuevaVersionString} con archivo nuevo`);
    } else {
      // Si no hay archivo nuevo, verificar si hay cambios significativos
      const cambiosSignificativos = hayCambiosSignificativos();

      if (cambiosSignificativos) {
        // Crear snapshot de la versión actual antes de actualizar
        await crearSnapshotVersion(false, cambios || "Actualización de metadata");

        // Calcular nueva versión (patch)
        const nuevaVersionString = calcularNuevaVersion(false);

        // Actualizar documento con metadata y nueva versión
        await doc.update({
          nombreArchivo,
          tipoDocumento,
          codigoDocumento,
          version: nuevaVersionString,
          versionActual: nuevaVersionString,
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

        console.log(`✅ Documento actualizado a versión ${nuevaVersionString} (cambios en metadata)`);
      } else {
        // Solo actualizar metadata sin crear versión
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

        console.log(`✅ Documento actualizado sin cambios significativos (no se creó versión)`);
      }
    }

    // Notificar asignación de revisor (si cambió y es diferente al usuario actual)
    if (revisadoPor && revisadoPor !== doc.revisadoPor && revisadoPor !== usuarioId) {
      try {
        await NotificacionesService.notificarAsignacionRevision(
          revisadoPor,
          doc.id,
          doc.nombre
        );
        console.log(`📧 Notificación enviada al revisor: ${revisadoPor}`);
      } catch (notifError) {
        console.error("Error al enviar notificación de revisión:", notifError);
        // No falla la operación si falla la notificación
      }
    }

    // Notificar asignación de aprobador (si cambió y es diferente al usuario actual)
    if (aprobadoPor && aprobadoPor !== doc.aprobadoPor && aprobadoPor !== usuarioId) {
      try {
        await NotificacionesService.notificarAsignacionAprobacion(
          aprobadoPor,
          doc.id,
          doc.nombre
        );
        console.log(`📧 Notificación enviada al aprobador: ${aprobadoPor}`);
      } catch (notifError) {
        console.error("Error al enviar notificación de aprobación:", notifError);
        // No falla la operación si falla la notificación
      }
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
