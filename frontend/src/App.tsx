import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Perfil from "./components/usuarios/Perfil";
import { ProtectedLayout } from "./components/ProtectedLayout";
import RolesPermisos from "./pages/rolespermisos";
import NuevoUsuario from "./pages/nuevousuario";
import ListaUsuario from "./pages/listausuarios";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con sidebar y navbar */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/rolespermisos" element={<RolesPermisos/>} />
          <Route path="/nuevousuario" element={<NuevoUsuario/>} />
          <Route path="/listausuarios" element={<ListaUsuario/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
