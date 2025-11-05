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
import AprobacionesPendientes from "./pages/documentos/Aprobaciones_Pendientes";
import DocumentosObsoletos from "./pages/documentos/Documentos_Obsoletos";
//areas ----------------------
import GestionarAreas from "./pages/areas/Gestionar_Areas";
import AreasResponsables from "./pages/areas/Asignar_Responsables";
//-------------------

//usuarios ----------------------
import ListaDeUsuarios from "./pages/usuarios/ListaDeUsuarios";
import NuevosUsuarios from "./pages/usuarios/NuevoUsuario";
import RolesYPermisos from "./pages/usuarios/Roles_Permisos";
//-------------------

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
            <Route path="/documentos/:id/aprobaciones" element={<AprobacionesPendientes />} />
            <Route path="/Aprobaciones_Pendientes" element={<AprobacionesPendientes />} />
            <Route path="/Documentos_Obsoletos" element={<DocumentosObsoletos />} />
            
            <Route path="/gestionar_areas" element={<GestionarAreas />} />
            <Route path="/Asignar_Responsables" element={<AreasResponsables />} />

            <Route path="/ListaDeUsuarios" element={<ListaDeUsuarios />} />
            <Route path="/NuevoUsuario" element={<NuevosUsuarios />} />
            <Route path="/Roles_y_Permisos" element={<RolesYPermisos />} />

            <Route path="/documentos/:id/editar" element={<EditarDocumento />} />
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
          </Route>

          {/* Ruta catch-all para manejar errores de tipeo */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
