import { useState } from "react";
import {
  CheckCircle,
  Laptop,
  Users,
  Calendar,
  Clock,
  MapPin,
  Link as LinkIcon,
  Tag,
} from "lucide-react";

interface Capacitacion {
  id: number;
  titulo: string;
  modalidad: "Virtual" | "Presencial";
  encargado: string;
  categoria: string;
  fecha: string;
  hora: string;
  ubicacion?: string;
  enlace?: string;
  estado: "Pendiente" | "Completada";
}

const CapacitacionesProgramadas = () => {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([
    {
      id: 1,
      titulo: "Capacitación en Seguridad Laboral",
      modalidad: "Presencial",
      encargado: "Carlos Castro",
      categoria: "Seguridad",
      fecha: "2025-11-20",
      hora: "09:00 AM",
      ubicacion: "Sede 2 - salon 302",
      estado: "Pendiente",
    },
    {
      id: 2,
      titulo: "Uso de Herramientas Digitales",
      modalidad: "Virtual",
      encargado: "María López",
      categoria: "Tecnología",
      fecha: "2025-11-25",
      hora: "02:00 PM",
      enlace: "https://meet.google.com/abc-123",
      estado: "Pendiente",
    },
  ]);

  const marcarCompletada = (id: number) => {
    setCapacitaciones((prev) =>
      prev.map((cap) =>
        cap.id === id ? { ...cap, estado: "Completada" } : cap
      )
    );
  };

  const total = capacitaciones.length;
  const virtuales = capacitaciones.filter(
    (c) => c.modalidad === "Virtual"
  ).length;
  const presenciales = capacitaciones.filter(
    (c) => c.modalidad === "Presencial"
  ).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Capacitaciones Programadas</h1>

      {/* Indicadores superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow p-4 text-center border">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center border">
          <p className="text-sm text-gray-500">Virtuales</p>
          <p className="text-3xl font-bold text-blue-600">{virtuales}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center border">
          <p className="text-sm text-gray-500">Presenciales</p>
          <p className="text-3xl font-bold text-green-600">{presenciales}</p>
        </div>
      </div>

      {/* Lista de capacitaciones */}
      <div className="space-y-4">
        {capacitaciones.map((cap) => (
          <div
            key={cap.id}
            className="bg-white shadow rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center border hover:shadow-md transition"
          >
            <div className="flex-1 w-full">
              <h2 className="text-lg font-semibold text-gray-800">
                {cap.titulo}
              </h2>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-500" />
                  <span>{cap.categoria}</span>
                </div>
                <div className="flex items-center gap-2">
                  {cap.modalidad === "Virtual" ? (
                    <Laptop className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Users className="w-4 h-4 text-green-500" />
                  )}
                  <span>{cap.modalidad}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{new Date(cap.fecha).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{cap.hora}</span>
                </div>
                {cap.modalidad === "Presencial" ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{cap.ubicacion}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-500" />
                    <a
                      href={cap.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Acceder a la reunión
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>Encargado: {cap.encargado}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col items-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                  cap.estado === "Pendiente"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {cap.estado}
              </span>

              {cap.estado === "Pendiente" ? (
                <button
                  onClick={() => marcarCompletada(cap.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Marcar como asistida
                </button>
              ) : (
                <div className="flex items-center text-green-600 font-medium text-sm">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  Completada
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapacitacionesProgramadas;
