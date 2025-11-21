const API_URL = "http://localhost:3000/api";

export interface Area {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  creadoEn?: string;
  actualizadoEn?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const areaService = {
  // Obtener todas las áreas
  async getAll(): Promise<Area[]> {
    const response = await fetch(`${API_URL}/areas`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener áreas");
    return response.json();
  },

  // Obtener un área por ID
  async getById(id: string): Promise<Area> {
    const response = await fetch(`${API_URL}/areas/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener área");
    return response.json();
  },

  // Crear nueva área
  async create(data: Partial<Area>): Promise<Area> {
    const response = await fetch(`${API_URL}/areas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear área");
    return response.json();
  },

  // Actualizar área
  async update(id: string, data: Partial<Area>): Promise<Area> {
    const response = await fetch(`${API_URL}/areas/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar área");
    return response.json();
  },

  // Eliminar área
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/areas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar área");
  },
};
