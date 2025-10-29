import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import NoConformidadesAbiertas from "@/pages/No_conformidades_Abiertas";
import NoConformidadesEnTratamiento from "@/pages/No_conformidades_EnTratamiento";
import NoConformidadesCerradas from "./pages/No_conformidades_Cerradas";
import Dashboard from "./pages/Dashboard";
import Perfil from "./components/usuarios/Perfil";
import { ProtectedLayout } from "./components/ProtectedLayout";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con sidebar y navbar */}
        <Route element={<ProtectedLayout />}>
          <Route path="/perfil" element={<Perfil />} />
          <Route
            path="/No_conformidades_Abiertas"
            element={<NoConformidadesAbiertas />}
          />
          <Route
            path="/No_conformidades_EnTratamiento"
            element={<NoConformidadesEnTratamiento />}
          />
          <Route
            path="/No_conformidades_Cerradas"
            element={<NoConformidadesCerradas />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
