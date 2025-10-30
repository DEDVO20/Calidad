import { RouteObject } from "react-router-dom";
import UsuarioMenu from "@/pages/usuario-menu";
import NuevoUsuario from "@/pages/nuevousuario";
import ListaUsuarios from "@/pages/listausuarios";
import RolesPermisos from "@/pages/rolespermisos";


export const usuarioRoutes: RouteObject = {
  path: "/usuarios",
  element: <UsuarioMenu />, // Este es el layout con el menú lateral
  children: [
    { path: "usuario", element: <UsuarioMenu/>},
    { path: "lista", element: <ListaUsuarios /> },
    { path: "nuevo", element: <NuevoUsuario /> },
    { path: "roles", element: <RolesPermisos /> },
  ],
}
export default App;