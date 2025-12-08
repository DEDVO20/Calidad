const API_URL = "http://localhost:3000/api";

export interface VersionDocumentoData {
    id: string;
    documentoId: string;
    numeroVersion: number;
    versionString: string;
    subidoEn: string;
    subidoPor: string;
    cambios?: string;
    rutaArchivo?: string;
    archivoUrl?: string;
    estado?: string;
    nombreArchivo?: string;
    tamañoBytes?: number;
}

export interface VersionComparison {
    version1: VersionDocumentoData;
    version2: VersionDocumentoData;
    diferencias: {
        cambioTamaño: number;
        cambioNombre: boolean;
    };
}

export interface DownloadInfo {
    url: string;
    nombreArchivo: string;
    versionString: string;
}

class VersionDocumentoService {
    private getAuthHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    async getByDocumento(documentoId: string): Promise<VersionDocumentoData[]> {
        const response = await fetch(
            `${API_URL}/versiones-documento/documento/${documentoId}`,
            {
                headers: this.getAuthHeader(),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.message || "Error al obtener versiones del documento"
            );
        }

        return response.json();
    }

    async getById(id: string): Promise<VersionDocumentoData> {
        const response = await fetch(`${API_URL}/versiones-documento/${id}`, {
            headers: this.getAuthHeader(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener versión");
        }

        return response.json();
    }

    async restore(id: string): Promise<any> {
        const response = await fetch(
            `${API_URL}/versiones-documento/${id}/restore`,
            {
                method: "POST",
                headers: this.getAuthHeader(),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al restaurar versión");
        }

        return response.json();
    }

    async compare(id1: string, id2: string): Promise<VersionComparison> {
        const response = await fetch(
            `${API_URL}/versiones-documento/compare/${id1}/${id2}`,
            {
                headers: this.getAuthHeader(),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al comparar versiones");
        }

        return response.json();
    }

    async getDownloadUrl(id: string): Promise<DownloadInfo> {
        const response = await fetch(
            `${API_URL}/versiones-documento/${id}/download`,
            {
                headers: this.getAuthHeader(),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener URL de descarga");
        }

        return response.json();
    }

    async download(id: string): Promise<void> {
        const downloadInfo = await this.getDownloadUrl(id);

        // Abrir en nueva pestaña para descargar
        window.open(downloadInfo.url, "_blank");
    }
}

export const versionDocumentoService = new VersionDocumentoService();
