const API_URL = "http://localhost:3000/api";

export interface Capacitacion {
  id: number;
  titulo: string;
  modalidad: "Virtual" | "Presencial";
  encargado: string;
  categoria: string;
  fecha: string;
  hora?: string;
  duracion?: string;
  ubicacion?: string;
  enlace?: string;
  estado: "Pendiente" | "Completada" | "En Curso";
  calificacion?: number;
  descripcion?: string;
  responsableId?: number;
}

export interface AsistenciaCapacitacion {
  id: number;
  capacitacionId: number;
  usuarioId: number;
  asistio: boolean;
  observaciones?: string;
  calificacion?: number;
  capacitacion?: Capacitacion;
  usuario?: {
    nombre: string;
    primerApellido: string;
  };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const capacitacionService = {
  // Obtener todas las capacitaciones
  async getAll(): Promise<Capacitacion[]> {
    const response = await fetch(`${API_URL}/capacitaciones`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener capacitaciones");
    return response.json();
  },

  // Obtener capacitaciones programadas (pendientes)
  async getProgramadas(): Promise<Capacitacion[]> {
    const response = await fetch(`${API_URL}/capacitaciones?estado=Pendiente`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener capacitaciones programadas");
    return response.json();
  },

  // Obtener historial de capacitaciones (completadas)
  async getHistorial(): Promise<Capacitacion[]> {
    const response = await fetch(`${API_URL}/capacitaciones?estado=Completada`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener historial");
    return response.json();
  },

  // Obtener una capacitación por ID
  async getById(id: number): Promise<Capacitacion> {
    const response = await fetch(`${API_URL}/capacitaciones/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener capacitación");
    return response.json();
  },

  // Crear nueva capacitación
  async create(data: Partial<Capacitacion>): Promise<Capacitacion> {
    const response = await fetch(`${API_URL}/capacitaciones`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear capacitación");
    return response.json();
  },

  // Actualizar capacitación
  async update(id: number, data: Partial<Capacitacion>): Promise<Capacitacion> {
    const response = await fetch(`${API_URL}/capacitaciones/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar capacitación");
    return response.json();
  },

  // Marcar como completada
  async marcarCompletada(id: number): Promise<Capacitacion> {
    const response = await fetch(`${API_URL}/capacitaciones/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ estado: "Completada" }),
    });
    if (!response.ok) throw new Error("Error al marcar como completada");
    return response.json();
  },

  // Eliminar capacitación
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/capacitaciones/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar capacitación");
  },

  // Obtener asistencias de una capacitación
  async getAsistencias(capacitacionId: number): Promise<AsistenciaCapacitacion[]> {
    const response = await fetch(
      `${API_URL}/asistencias-capacitacion?capacitacionId=${capacitacionId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) throw new Error("Error al obtener asistencias");
    return response.json();
  },

  // Registrar asistencia
  async registrarAsistencia(
    data: Partial<AsistenciaCapacitacion>
  ): Promise<AsistenciaCapacitacion> {
    const response = await fetch(`${API_URL}/asistencias-capacitacion`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al registrar asistencia");
    return response.json();
  },
};
