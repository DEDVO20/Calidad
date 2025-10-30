import { useState } from "react";

interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Documento {
  id: number;
  nombre: string;
  estado: string;
}

const RolesPermisos = () => {
  // Estado de roles
  const [roles, setRoles] = useState<Rol[]>([
    { id: 1, nombre: "Administrador", descripcion: "Acceso total al sistema" },
    { id: 2, nombre: "Editor", descripcion: "Puede editar contenido y usuarios" },
    { id: 3, nombre: "Usuario", descripcion: "Acceso limitado a sus propios datos" },
  ]);

  const [nuevoRol, setNuevoRol] = useState({ nombre: "", descripcion: "" });

  // Aprobaciones pendientes
  const [aprobacionesPendientes] = useState<Documento[]>([
    { id: 1, nombre: "Informe de Seguridad 2025", estado: "En revisión" },
    { id: 2, nombre: "Política de Privacidad", estado: "Pendiente de aprobación" },
  ]);

  // Documentos obsoletos
  const [documentosObsoletos] = useState<Documento[]>([
    { id: 1, nombre: "Manual de Usuario 2022", estado: "Obsoleto" },
    { id: 2, nombre: "Reglamento Interno 2021", estado: "Reemplazado" },
  ]);

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoRol.nombre.trim()) return;

    const rol: Rol = {
      id: roles.length + 1,
      nombre: nuevoRol.nombre,
      descripcion: nuevoRol.descripcion,
    };

    setRoles([...roles, rol]);
    setNuevoRol({ nombre: "", descripcion: "" });
  };

  const handleDelete = (id: number) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-semibold mb-6">Gestión de Roles</h1>

      {/* Formulario para agregar roles */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Nombre del rol"
          className="border rounded p-2 w-48"
          value={nuevoRol.nombre}
          onChange={(e) => setNuevoRol({ ...nuevoRol, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          className="border rounded p-2 flex-1"
          value={nuevoRol.descripcion}
          onChange={(e) => setNuevoRol({ ...nuevoRol, descripcion: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar
        </button>
      </form>

      {/* Tabla de roles */}
      <table className="min-w-full bg-white border rounded shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Nombre</th>
            <th className="border px-4 py-2 text-left">Descripción</th>
            <th className="border px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{rol.id}</td>
              <td className="border px-4 py-2">{rol.nombre}</td>
              <td className="border px-4 py-2">{rol.descripcion}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(rol.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sección de aprobaciones pendientes */}
      <div>
        <h2 className="text-xl font-semibold mt-10 mb-4">Aprobaciones Pendientes</h2>
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

export default RolesPermisos;
// stevan