const API_URL = "http://localhost:3000/api";

export interface NoConformidad {
  id: number;
  codigo: string;
  tipo?: string;
  descripcion: string;
  estado: string;
  gravedad?: string;
  fechaDeteccion: string;
  responsableId?: number;
  areaId?: number;
  documentoId?: number;
  creadoEn?: string;
  actualizadoEn?: string;
  responsable?: {
    id: number;
    nombre: string;
    primerApellido: string;
  };
  area?: {
    id: number;
    nombre: string;
  };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const noConformidadService = {
  // Obtener todas las no conformidades
  async getAll(): Promise<NoConformidad[]> {
    const response = await fetch(`${API_URL}/noconformidades`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener no conformidades");
    return response.json();
  },

  // Obtener no conformidades abiertas
  async getAbiertas(): Promise<NoConformidad[]> {
    const response = await fetch(`${API_URL}/noconformidades/abiertas`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener no conformidades abiertas");
    return response.json();
  },

  // Obtener no conformidades en tratamiento
  async getEnTratamiento(): Promise<NoConformidad[]> {
    const response = await fetch(`${API_URL}/noconformidades/en-tratamiento`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok)
      throw new Error("Error al obtener no conformidades en tratamiento");
    return response.json();
  },

  // Obtener no conformidades cerradas
  async getCerradas(): Promise<NoConformidad[]> {
    const response = await fetch(`${API_URL}/noconformidades/cerradas`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener no conformidades cerradas");
    return response.json();
  },

  // Obtener no conformidades por estado
  async getByEstado(estado: string): Promise<NoConformidad[]> {
    const response = await fetch(`${API_URL}/noconformidades?estado=${estado}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener no conformidades");
    return response.json();
  },

  // Obtener una no conformidad por ID
  async getById(id: number): Promise<NoConformidad> {
    const response = await fetch(`${API_URL}/noconformidades/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener no conformidad");
    return response.json();
  },

  // Crear nueva no conformidad
  async create(data: Partial<NoConformidad>): Promise<NoConformidad> {
    const response = await fetch(`${API_URL}/noconformidades`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear no conformidad");
    return response.json();
  },

  // Actualizar no conformidad
  async update(id: number, data: Partial<NoConformidad>): Promise<NoConformidad> {
    const response = await fetch(`${API_URL}/noconformidades/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar no conformidad");
    return response.json();
  },

  // Iniciar tratamiento de no conformidad
  async iniciarTratamiento(id: number): Promise<NoConformidad> {
    const response = await fetch(
      `${API_URL}/noconformidades/${id}/iniciar-tratamiento`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) throw new Error("Error al iniciar tratamiento");
    return response.json();
  },

  // Cerrar no conformidad
  async cerrar(id: number, observaciones?: string): Promise<NoConformidad> {
    const response = await fetch(`${API_URL}/noconformidades/${id}/cerrar`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ observaciones }),
    });
    if (!response.ok) throw new Error("Error al cerrar no conformidad");
    return response.json();
  },

  // Eliminar no conformidad
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/noconformidades/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar no conformidad");
  },
};
