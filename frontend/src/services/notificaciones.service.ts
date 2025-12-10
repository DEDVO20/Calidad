import axios from "axios";

// Usar ruta relativa para que funcione con el proxy de Vite
const API_URL = "/api";

export interface Notificacion {
    id: string;
    usuarioId: string;
    titulo: string;
    mensaje: string;
    tipo: string;
    leida: boolean;
    fechaLectura?: string;
    referenciaTipo?: string;
    referenciaId?: string;
    creadoEn: string;
}

export interface NotificacionesResponse {
    total: number;
    items: Notificacion[];
}

export const notificacionesService = {
    /**
     * Obtener todas las notificaciones del usuario
     */
    async getNotificaciones(leida?: boolean): Promise<NotificacionesResponse> {
        const token = localStorage.getItem("token");
        const params: any = {};
        if (leida !== undefined) {
            params.leida = leida;
        }

        const response = await axios.get(`${API_URL}/notificaciones`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
        return response.data;
    },

    /**
     * Obtener conteo de no leídas
     */
    async getNoLeidasCount(): Promise<number> {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/notificaciones/no-leidas/count`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.count;
    },

    /**
     * Marcar una notificación como leída
     */
    async marcarComoLeida(id: string): Promise<void> {
        const token = localStorage.getItem("token");
        await axios.patch(
            `${API_URL}/notificaciones/${id}/leer`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },

    /**
     * Marcar todas como leídas
     */
    async marcarTodasComoLeidas(): Promise<void> {
        const token = localStorage.getItem("token");
        await axios.patch(
            `${API_URL}/notificaciones/leer-todas`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },

    /**
     * Eliminar notificación
     */
    async eliminar(id: string): Promise<void> {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/notificaciones/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};
