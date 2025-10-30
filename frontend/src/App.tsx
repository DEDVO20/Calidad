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
import GestionDocumental from "./pages/GestionDocumental";
import ControlVersiones from "./pages/ControlVersiones";


import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con sidebar y navbar */}
        <Route element={<ProtectedLayout />}>   // esta linea router 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/GestionDocumental" element={<GestionDocumental />} />
          <Route path="/ControlVersiones" element={<ControlVersiones />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
