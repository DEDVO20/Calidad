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
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
