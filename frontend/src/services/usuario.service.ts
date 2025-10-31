const API_URL = import.meta.env.VITE_API_URL;

export interface Usuario {
  id: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  correoElectronico: string;
  numeroDocumento: string;
  telefono?: string;
  cargo?: string;
  activo: boolean;
  foto_url?: string;
  fotoUrl?: string;
}

export interface UsuariosListResponse {
  usuarios: Usuario[];
  total: number;
  page: number;
  totalPages: number;
}

class UsuarioService {
  private getAuthHeader() {
    const token = localStorage.getItem("authToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
    activo?: boolean;
  }): Promise<UsuariosListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.activo !== undefined)
      queryParams.append("activo", params.activo.toString());

    const response = await fetch(
      `${API_URL}/usuarios?${queryParams.toString()}`,
      {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener usuarios");
    }

    return response.json();
  }

  async getById(id: string): Promise<Usuario> {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      headers: {
        ...this.getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener usuario");
    }

    return response.json();
  }

  async create(userData: Partial<Usuario>): Promise<Usuario> {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        ...this.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear usuario");
    }

    return response.json();
  }

  async update(id: string, userData: Partial<Usuario>): Promise<Usuario> {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: {
        ...this.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar usuario");
    }

    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al eliminar usuario");
    }
  }

  /**
   * Obtiene todos los usuarios activos para selects
   */
  async getAllActive(): Promise<Usuario[]> {
    const response = await this.getAll({ activo: true, limit: 1000 });
    return response.usuarios;
  }
}

export const usuarioService = new UsuarioService();
