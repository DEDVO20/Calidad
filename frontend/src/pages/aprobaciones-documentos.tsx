import { useState } from "react";

interface Documento {
  id: number;
  nombre: string;
  estado: string;
}

const AprobacionesDocumentos = () => {
  // Datos de ejemplo para aprobaciones pendientes
  const [aprobacionesPendientes] = useState<Documento[]>([
    { id: 1, nombre: "Informe de Seguridad 2025", estado: "En revisión" },
    { id: 2, nombre: "Política de Privacidad", estado: "Pendiente de aprobación" },
  ]);

  // Datos de ejemplo para documentos obsoletos
  const [documentosObsoletos] = useState<Documento[]>([
    { id: 1, nombre: "Manual de Usuario 2022", estado: "Obsoleto" },
    { id: 2, nombre: "Reglamento Interno 2021", estado: "Reemplazado" },
  ]);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-semibold mb-6">Gestión Documental</h1>

      {/* Sección de aprobaciones pendientes */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Aprobaciones Pendientes</h2>
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead className="bg-yellow-100">
            <tr>
              <th className="border px-4 py-2 text-left">Nombre</th>
              <th className="border px-4 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {aprobacionesPendientes.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{doc.nombre}</td>
                <td className="border px-4 py-2 text-yellow-600 font-medium">{doc.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de documentos obsoletos */}
      <div>
        <h2 className="text-xl font-semibold mt-10 mb-4">Documentos Obsoletos</h2>
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead className="bg-red-100">
            <tr>
              <th className="border px-4 py-2 text-left">Nombre</th>
              <th className="border px-4 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {documentosObsoletos.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{doc.nombre}</td>
                <td className="border px-4 py-2 text-red-600 font-medium">{doc.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AprobacionesDocumentos;
