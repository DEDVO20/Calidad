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
import NoConformidadesHistorialCompleto from "./pages/No_conformidades_HistorialCompleto";
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
        <Route path="/No_conformidades_Abiertas" element={<NoConformidadesAbiertas />} />
        <Route path="/No_conformidades_EnTratamiento" element={<NoConformidadesEnTratamiento />} />
        <Route path="/No_conformidades_Cerradas" element={<NoConformidadesCerradas />} />
        <Route path="/No_conformidades_HistorialCompleto" element={<NoConformidadesHistorialCompleto />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
