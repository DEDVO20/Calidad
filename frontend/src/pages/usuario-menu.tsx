import { NavLink, Outlet } from "react-router-dom";

const UsuarioMenu = () => {
  return (
    <div className="flex">
      <aside className="w-60 bg-gray-100 p-5 h-screen shadow-md">
        <h2 className="text-lg font-semibold mb-6">Gestión de Usuarios</h2>
        <ul className="space-y-4">
          <li><NavLink to="nuevo">Nuevo Usuario</NavLink></li>
          <li><NavLink to="lista">Lista de Usuarios</NavLink></li>
          <li><NavLink to="roles">Roles y Permisos</NavLink></li>
        </ul>
      </aside>

      {/* Aquí se muestra el contenido de cada página */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UsuarioMenu;
