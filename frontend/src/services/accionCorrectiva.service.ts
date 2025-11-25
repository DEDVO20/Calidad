const API_URL = "http://localhost:3000/api";

export interface AccionCorrectiva {
  id: string;
  codigo: string;
  tipo: string;
  descripcion: string;
  analisisCausaRaiz: string;
  planAccion: string;
  responsableId: string;
  fechaCompromiso: string;
  fechaImplementacion?: string;
  estado: string;
  observacion?: string;
  creadoEn: string;
  actualizadoEn?: string;
  responsable?: {
    id: string;
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

export const accionCorrectivaService = {
  // Obtener todas las acciones correctivas
  async getAll(): Promise<AccionCorrectiva[]> {
    const response = await fetch(`${API_URL}/acciones-correctivas`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener acciones correctivas");
    return response.json();
  },

  // Obtener acciones por estado
  async getByEstado(estado: string): Promise<AccionCorrectiva[]> {
    const response = await fetch(`${API_URL}/acciones-correctivas?estado=${estado}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener acciones correctivas");
    return response.json();
  },

  // Obtener acciones en proceso
  async getEnProceso(): Promise<AccionCorrectiva[]> {
    const response = await fetch(
      `${API_URL}/acciones-correctivas?estado=en_proceso,pendiente,en_ejecucion`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) throw new Error("Error al obtener acciones en proceso");
    return response.json();
  },

  // Obtener acciones verificadas
  async getVerificadas(): Promise<AccionCorrectiva[]> {
    const response = await fetch(
      `${API_URL}/acciones-correctivas?estado=verificada`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) throw new Error("Error al obtener acciones verificadas");
    return response.json();
  },

  // Obtener acciones cerradas
  async getCerradas(): Promise<AccionCorrectiva[]> {
    const response = await fetch(
      `${API_URL}/acciones-correctivas?estado=cerrada,completada`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) throw new Error("Error al obtener acciones cerradas");
    return response.json();
  },

  // Obtener acciones nuevas
  async getNuevas(): Promise<AccionCorrectiva[]> {
    const response = await fetch(
      `${API_URL}/acciones-correctivas?estado=nueva,pendiente`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) throw new Error("Error al obtener acciones nuevas");
    return response.json();
  },

  // Obtener una acción por ID
  async getById(id: string): Promise<AccionCorrectiva> {
    const response = await fetch(`${API_URL}/acciones-correctivas/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener acción correctiva");
    return response.json();
  },

  // Crear nueva acción correctiva
  async create(data: Partial<AccionCorrectiva>): Promise<AccionCorrectiva> {
    const response = await fetch(`${API_URL}/acciones-correctivas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear acción correctiva");
    return response.json();
  },

  // Actualizar acción correctiva
  async update(id: string, data: Partial<AccionCorrectiva>): Promise<AccionCorrectiva> {
    const response = await fetch(`${API_URL}/acciones-correctivas/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar acción correctiva");
    return response.json();
  },

  // Cambiar estado de acción correctiva
  async cambiarEstado(id: string, estado: string): Promise<AccionCorrectiva> {
    const response = await fetch(`${API_URL}/acciones-correctivas/${id}/estado`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ estado }),
    });
    if (!response.ok) throw new Error("Error al cambiar estado");
    return response.json();
  },

  // Verificar acción correctiva
  async verificar(id: string, observaciones?: string): Promise<AccionCorrectiva> {
    const response = await fetch(`${API_URL}/acciones-correctivas/${id}/verificar`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ observaciones }),
    });
    if (!response.ok) throw new Error("Error al verificar acción correctiva");
    return response.json();
  },

  // Eliminar acción correctiva
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/acciones-correctivas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al eliminar acción correctiva");
  },
};
