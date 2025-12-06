import Notificacion from "../models/notificacion.model";

interface CrearNotificacionParams {
    usuarioId: string;
    tipo: string;
    titulo: string;
    mensaje: string;
    referenciaTipo?: string;
    referenciaId?: string;
}

export class NotificacionesService {
    /**
     * Crear una notificación
     */
    static async crearNotificacion(params: CrearNotificacionParams): Promise<Notificacion> {
        return await Notificacion.create(params);
    }

    /**
     * Notificar asignación de revisión
     */
    static async notificarAsignacionRevision(
        usuarioId: string,
        documentoId: string,
        nombreDocumento: string
    ): Promise<Notificacion> {
        return await this.crearNotificacion({
            usuarioId,
            tipo: "asignacion_revision",
            titulo: "Documento asignado para revisión",
            mensaje: `Se te ha asignado el documento "${nombreDocumento}" para revisión`,
            referenciaTipo: "documento",
            referenciaId: documentoId,
        });
    }

    /**
     * Notificar asignación de aprobación
     */
    static async notificarAsignacionAprobacion(
        usuarioId: string,
        documentoId: string,
        nombreDocumento: string
    ): Promise<Notificacion> {
        return await this.crearNotificacion({
            usuarioId,
            tipo: "asignacion_aprobacion",
            titulo: "Documento asignado para aprobación",
            mensaje: `Se te ha asignado el documento "${nombreDocumento}" para aprobación`,
            referenciaTipo: "documento",
            referenciaId: documentoId,
        });
    }

    /**
     * Notificar aprobación de documento
     */
    static async notificarDocumentoAprobado(
        usuarioId: string,
        documentoId: string,
        nombreDocumento: string
    ): Promise<Notificacion> {
        return await this.crearNotificacion({
            usuarioId,
            tipo: "documento_aprobado",
            titulo: "Documento aprobado",
            mensaje: `Tu documento "${nombreDocumento}" ha sido aprobado`,
            referenciaTipo: "documento",
            referenciaId: documentoId,
        });
    }

    /**
     * Notificar rechazo de documento
     */
    static async notificarDocumentoRechazado(
        usuarioId: string,
        documentoId: string,
        nombreDocumento: string,
        motivo?: string
    ): Promise<Notificacion> {
        const mensajeBase = `Tu documento "${nombreDocumento}" ha sido rechazado`;
        const mensaje = motivo ? `${mensajeBase}. Motivo: ${motivo}` : mensajeBase;

        return await this.crearNotificacion({
            usuarioId,
            tipo: "documento_rechazado",
            titulo: "Documento rechazado",
            mensaje,
            referenciaTipo: "documento",
            referenciaId: documentoId,
        });
    }

    /**
     * Notificar modificación de documento
     */
    static async notificarDocumentoModificado(
        usuarioId: string,
        documentoId: string,
        nombreDocumento: string
    ): Promise<Notificacion> {
        return await this.crearNotificacion({
            usuarioId,
            tipo: "documento_modificado",
            titulo: "Documento modificado",
            mensaje: `El documento "${nombreDocumento}" que revisaste ha sido modificado`,
            referenciaTipo: "documento",
            referenciaId: documentoId,
        });
    }
}

export default NotificacionesService;
