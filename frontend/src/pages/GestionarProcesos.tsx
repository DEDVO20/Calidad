import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

interface Proceso {
  id: number;
  nombre: string;
  tipo: string;
  propietario: string;
  estado: "Activo" | "Inactivo";
}

const GestionarProcesos = () => {
  const [search, setSearch] = useState("");

  // Datos de ejemplo (luego conectamos a tu backend o Firebase)
  const procesos: Proceso[] = [
    { id: 1, nombre: "Planificación Estratégica", tipo: "Estratégico", propietario: "Dirección", estado: "Activo" },
    { id: 2, nombre: "Gestión Comercial", tipo: "Misional", propietario: "Comercial", estado: "Activo" },
    { id: 3, nombre: "Talento Humano", tipo: "Apoyo", propietario: "RRHH", estado: "Inactivo" },
    { id: 4, nombre: "Auditorías Internas", tipo: "Evaluación", propietario: "Calidad", estado: "Activo" },
  ];

  const filtered = procesos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Título */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Gestionar Procesos</h1>
      <p className="text-gray-600 mb-6">
        Administra los procesos del Sistema de Gestión de Calidad: registra, actualiza y controla
        su estado dentro de la organización.
      </p>

      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        {/* Buscador */}
        <div className="flex items-center px-4 py-2 bg-white border rounded-xl shadow-sm w-full sm:w-72">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar proceso..."
            className="ml-2 w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Botón crear */}
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition">
          <Plus className="w-5 h-5" />
          Nuevo Proceso
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border shadow-sm bg-white">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Propietario</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {filtered.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-4">{p.nombre}</td>
                <td className="py-3 px-4">{p.tipo}</td>
                <td className="py-3 px-4">{p.propietario}</td>

                {/* Estado */}
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      p.estado === "Activo"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {p.estado}
                  </span>
                </td>

                {/* Acciones */}
                <td className="py-3 px-4 flex justify-center gap-3">
                  <Eye className="w-5 h-5 text-blue-600 cursor-pointer hover:scale-110 transition" />
                  <Edit className="w-5 h-5 text-yellow-600 cursor-pointer hover:scale-110 transition" />
                  <Trash2 className="w-5 h-5 text-red-600 cursor-pointer hover:scale-110 transition" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center py-6 text-gray-500">No se encontraron procesos…</p>
        )}
      </div>
    </div>
  );
};

export default GestionarProcesos;
