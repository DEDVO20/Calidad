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
import AccionesCorrectivasCerradas from "./pages/Acciones_correctivas_Cerradas";
import AccionesCorrectivasVerificadas from "./pages/Acciones_correctivas_Verificadas";
import Dashboard from "./pages/Dashboard";
import Perfil from "./components/usuarios/Perfil";
import Documentos from "./pages/Documentos";
import CreateDocument from "./components/documents/CreateDocument";
import VerDocumento from "./pages/VerDocumento";
import EditarDocumento from "./pages/EditarDocumento";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas con sidebar y navbar */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/documentos/crear" element={<CreateDocument />} />
            <Route path="/documentos/:id" element={<VerDocumento />} />
            <Route
              path="/documentos/:id/editar"
              element={<EditarDocumento />}
            />
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
            <Route
              path="/Acciones_correctivas_Cerradas"
              element={<AccionesCorrectivasCerradas />}
            />
            <Route
              path="/Acciones_correctivas_Verificadas"
              element={<AccionesCorrectivasVerificadas />}
            />
          </Route>

          {/* Ruta catch-all para manejar errores de tipeo */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
