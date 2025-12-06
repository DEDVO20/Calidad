import axios from "axios";

const API_URL = "/api/documentos";

export interface AprobacionesResumen {
    pendientes: {
        total: number;
        items: any[];
    };
    aprobados: {
        total: number;
        items: any[];
    };
    rechazados: {
        total: number;
        items: any[];
    };
}

export const aprobacionesService = {
    async getPendientes() {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/pendientes/lista`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    async aprobar(documentoId: string, comentarios?: string) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${API_URL}/${documentoId}/aprobar`,
            { comentarios },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    async rechazar(documentoId: string, comentarios: string) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${API_URL}/${documentoId}/rechazar`,
            { comentarios },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    async getMisAprobaciones(): Promise<AprobacionesResumen> {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/mis-aprobaciones/resumen`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};
